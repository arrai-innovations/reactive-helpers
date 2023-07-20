import { addOrUpdateReactiveObject, assignReactiveObject } from "../utils/assignReactiveObject.js";
import { getFakeId } from "../utils/getFakeId.js";
import inspect from "browser-util-inspect";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { computed, effectScope, reactive, toRef, watchEffect } from "vue";

export class ListError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "ListError";
        this.code = code;
    }
}

const defaultCrud = {
    args: {},
    list: undefined,
};

export const listInstanceStateKeys = [
    "crud",
    "retrieveArgs",
    "listArgs",
    "objects",
    "loading",
    "errored",
    "error",
    "objectsInOrder",
    "order",
    // when paged
    "totalRecords",
    "totalPages",
    "perPage",
];

export function setListInstanceCrud({ list, args = {} } = {}) {
    defaultCrud.list = list;
    Object.assign(defaultCrud.args, args);
}

export function useListInstances(listInstanceArgs) {
    const instances = {};
    for (const [key, value] of Object.entries(listInstanceArgs)) {
        instances[key] = useListInstance(value);
    }
    return instances;
}

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
        errored: false,
        error: null,
    });
    const es = effectScope();
    watchEffect(() => {
        // prevent linking of all instances to the same default .args object
        Object.assign(state.crud, cloneDeep(defaultCrud));
        if (props.crudArgs) {
            addOrUpdateReactiveObject(state.crud.args, props.crudArgs);
        }
        for (const [key, value] of Object.entries(functions)) {
            if (isFunction(value) && key in state.crud) {
                state.crud[key] = value;
            } else {
                throw ListError(`Invalid function "${key}" for useListInstance: invalid key or not a function.`);
            }
        }
    });

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
    }

    function deleteListObject(objectId) {
        if (!(objectId in state.objects)) {
            throw new ListError(
                `deleteListObject: list missing object for removal by id: ${inspect(objectId)}`,
                "missing-object"
            );
        }
        delete state.objects[objectId];
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

    state.objectsInOrder = computed(() => Object.values(state.objects));
    state.order = computed(() => Object.keys(state.objects));

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
