import { getListCrud } from "../config/listCrud.js";
import { assignReactiveObject } from "../utils/assignReactiveObject.js";
import { getFakeId } from "../utils/getFakeId.js";
import inspect from "browser-util-inspect";
import { effectScope, reactive, toRef, watch, computed, unref } from "vue";

export class ListError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "ListError";
        this.code = code;
    }
}

/**
 * The configuration options used to create a list instance.
 * @typedef {object} ListInstanceOptions
 * @property {object} props - props passed to the component
 * @property {object} props.retrieveArgs - the arguments passed to the server
 * @property {object} props.listArgs - the arguments passed to the server
 * @property {object} props.crudArgs - implementation specific arguments
 * @property {object} functions - optional. default implementation are used as set by `setListCrud`.
 * @property {Function} functions.list - provide the implementation for the list function
 * @property {Function} functions.subscribe - provide the implementation for the subscribe function
 * @property {boolean} keepOldPages - if true, pages will not be cleared when defaultPageCallback is called. default is false.
 */

/* eslint-disable jsdoc/check-types */
// types valid for jsdoc-to-markdown, which uses the strict jsdoc.app. Object shorthand syntax doesn't work.
/**
 * A Vue composition function that creates multiple list instances, and returns them as an object.
 * @param {Object.<string, ListInstanceOptions>} listInstanceArgs - each desired list instance options, keyed by an instance name.
 * @returns {Object.<string, ListInstance>} - each list instance, keyed by the instance name.
 */

/* eslint-enable jsdoc/check-types */
export function useListInstances(listInstanceArgs) {
    const instances = {};
    for (const [key, value] of Object.entries(listInstanceArgs)) {
        instances[key] = useListInstance(value);
    }
    return instances;
}

/**
 * A reactive object that manages a list of objects, as returned by `useListInstance`.
 * @typedef {object} ListInstanceState
 * @property {object} crud - the crud functions
 * @property {object} crud.args - the arguments passed to the crud functions
 * @property {Function} crud.list - the list function
 * @property {Function} crud.subscribe - the subscribe function
 * @property {object} retrieveArgs - the arguments passed to the server
 * @property {object} listArgs - the arguments passed to the server
 * @property {Map} objects - the objects in the list
 * @property {boolean} loading - true if the list is loading
 * @property {boolean} errored - true if the list has errored
 * @property {object} error - the error object
 * @property {Array} objectsInOrder - the objects in the list in order
 * @property {Array} order - the order of the objects in the list
 * @property {number} totalRecords - the total number of records
 * @property {number} totalPages - the total number of pages
 * @property {number} perPage - the number of records per page
 */

/**
 * @typedef {object} ListInstance
 * @property {Function} list - subscribe to updates from the implementation
 * @property {Function} addListObject - add an object to the list
 * @property {Function} updateListObject - update an object in the list
 * @property {Function} deleteListObject - delete an object from the list
 * @property {Function} clearList - clear the list
 * @property {Function} clearError - clear the error
 * @property {Function} getFakeId - get a fake id
 * @property {Function} defaultPageCallback - the default page callback
 * @property {Function} pageCallback - the page callback
 * @property {ListInstanceState} state - the list instance state
 * @property {object} effectScope - a Vue effect scope
 */

/**
 * `useListInstance` is a Vue composition function that manages a list of objects.
 * It has the ability to retrieve the list from an implementation, or subscribe to updates from an implementation.
 * It tracks the objects in the list, and their added order.
 * @param {ListInstanceOptions} options - the options used to create the list instance
 * @returns {ListInstance} - the list instance
 */
export function useListInstance({ props, functions = {}, keepOldPages = false }) {
    if (!props) {
        throw new ListError(`useListInstance requires props`);
    }
    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    const _objectsMap = new Map(); // maps are ordered, if you don't clear lists, you need to insert pages in order.
    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    const _objectsProxy = new Proxy(_objectsMap, {
        get(target, prop) {
            return target.get(prop); // map's get not Reflect.get
        },
        has(target, prop) {
            return target.has(prop); // map's has not Reflect.has
        },
        set(target, prop, value) {
            target.set(prop, value); // map.set() returns the map, we don't need that
            if (!state.running) {
                state.running = true;
            }
            return true;
        },
        ownKeys(target) {
            return [...target.keys()]; // map.keys() returns an iterator, we need an array
        },
        deleteProperty(target, p) {
            target.delete(p); // map.delete() returns false if the key didn't exist
            return true; // objects return true regardless of whether the property existed
        },
        getOwnPropertyDescriptor(target, p) {
            const value = target.get(p);
            return value
                ? {
                      configurable: true,
                      enumerable: true,
                      value,
                      writable: true,
                  }
                : Reflect.getOwnPropertyDescriptor(target, p); // we can't report target properties as non-existent re: proxy invariants
        },
        // things introspect us thing we are a map, we need to pretend to be a object
        getPrototypeOf() {
            return Object.prototype;
        },
    });
    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    const state = reactive({
        crud: {
            args: {},
            list: undefined,
        },
        retrieveArgs: toRef(props, "retrieveArgs"),
        listArgs: toRef(props, "listArgs"),
        objects: _objectsProxy,
        loading: undefined,
        running: false,
        errored: false,
        error: null,
        order: [],
        objectsInOrder: [],
        objectsInOrderRefs: [],
    });
    const es = effectScope();

    getListCrud(state.crud, { props, functions });

    const defaultPageCallback = (newObjects) => {
        // with keepOldPages, you are responsible for clearing the list as needed
        if (!keepOldPages) {
            // display one page at a time, clear the list
            clearList();
        }
        newObjects.forEach((newObject) => {
            if (newObject.id in state.objects) {
                updateListObject(newObject);
            } else {
                addListObject(newObject);
            }
        });
    };

    const promises = {
        list: null,
    };

    function list() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (promises.list) {
            // if a retrieve is already in progress, return the existing promise
            return promises.list;
        }
        if (state.loading) {
            return Promise.reject(new ListError("already loading."));
        }
        let returnPromiseResolve;
        promises.list = new Promise((resolve) => (returnPromiseResolve = resolve));
        state.loading = true;
        state.errored = false;
        state.error = null;
        const listPromise = state.crud.list({
            crudArgs: state.crud.args,
            retrieveArgs: state.retrieveArgs,
            listArgs: state.listArgs,
            pageCallback: returnedObject.pageCallback,
        });
        let resolveState = false;
        if (listPromise.cancel) {
            promises.list.cancel = async () => {
                let promise = listPromise.cancel();
                if (promise) {
                    await promise;
                }
            };
        }
        // the indirection of promises here is to allow us to do additional work on listPromise's cancel
        listPromise
            .then(() => {
                resolveState = true;
            })
            .catch((error) => {
                state.errored = true;
                state.error = error;
            })
            .finally(() => {
                state.loading = false;
                returnPromiseResolve(resolveState);
                promises.list = null;
            });
        return promises.list;
    }

    function addListObject(object) {
        if (!object.id) {
            throw new ListError(`addListObject: object missing id.\n${inspect(object)}`, "missing-id");
        }
        if (object.id in state.objects) {
            throw new ListError(`addListObject: list already has object for id: ${inspect(object.id)}`, "duplicate-id");
        }
        state.objects[object.id] = object;
        if (!state.running) {
            state.running = true;
        }
    }

    function updateListObject(object) {
        if (!object.id) {
            throw new ListError(`updateListObject: object missing id.\n${inspect(object)}`, "missing-id");
        }
        if (!(object.id in state.objects)) {
            throw new ListError(
                `updateListObject: list missing object for update by id: ${inspect(object.id)}`,
                "missing-object"
            );
        }
        assignReactiveObject(state.objects[object.id], object);
        if (!state.running) {
            state.running = true;
        }
    }

    function deleteListObject(objectId) {
        if (!(objectId in state.objects)) {
            throw new ListError(
                `deleteListObject: list missing object for removal by id: ${inspect(objectId)}`,
                "missing-object"
            );
        }
        delete state.objects[objectId];
        if (!state.running) {
            state.running = true;
        }
    }

    function clearList() {
        assignReactiveObject(state.objects, {});
        clearError();
    }

    function ourGetFakeId() {
        return getFakeId(state.objects);
    }

    function clearError() {
        state.errored = false;
        state.error = null;
    }

    es.run(() => {
        watch(
            toRef(state, "objects"),
            () => {
                assignReactiveObject(
                    state.objectsInOrderRefs,
                    Object.keys(state.objects).map((id) => toRef(state.objects, id))
                );
                if (state.running) {
                    state.running = false;
                }
            },
            {
                immediate: true,
                deep: true,
            }
        );
        state.objectsInOrder = computed(() => state.objectsInOrderRefs.map((ref) => unref(ref)));
        state.order = computed(() => Object.keys(state.objects));
    });

    const returnedObject = {
        state,
        list,
        addListObject,
        updateListObject,
        deleteListObject,
        clearList,
        clearError,
        getFakeId: ourGetFakeId,
        defaultPageCallback,
        pageCallback: defaultPageCallback,
        effectScope: es,
    };
    return returnedObject;
}
