import inspect from "browser-util-inspect";
import { cloneDeep } from "lodash";
import { computed, effectScope, reactive } from "vue";
import { addOrUpdateReactiveObject, assignReactiveObject } from "../utils/assignReactiveObject";
import { getFakeId } from "../utils/getFakeId";

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

export function useListInstance({ crudArgs, listArgs = {}, retrieveArgs = {} }) {
    // ### touching the _objectsMap or _objectsProxy directly will not trigger reactivity ###
    const _objectsMap = new Map();
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
        retrieveArgs,
        listArgs,
        objects: _objectsProxy,
        loading: undefined,
        errored: false,
        error: null,
    });
    // prevent linking of all instances to the same default .args object
    Object.assign(state.crud, cloneDeep(defaultCrud));
    if (crudArgs) {
        addOrUpdateReactiveObject(state.crud.args, crudArgs);
    }

    const defaultPageCallback = (newObjects) => {
        newObjects.forEach((newObject) => {
            if (newObject.id in state.objects) {
                updateListObject(newObject);
            } else {
                addListObject(newObject);
            }
        });
    };

    function list() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (state.loading) {
            return Promise.reject(new ListError("already loading."));
        }
        let returnPromiseResolve;
        const returnPromise = new Promise((resolve) => {
            returnPromiseResolve = resolve;
        });
        state.loading = true;
        state.errored = false;
        state.error = null;
        const listPromise = state.crud.list({
            crudArgs: state.crud.args,
            retrieveArgs: state.retrieveArgs,
            listArgs: state.listArgs,
            pageCallback: returnedObject.pageCallback,
        });
        if (listPromise.cancel) {
            returnPromise.cancel = async () => {
                let promise = listPromise.cancel();
                state.loading = false;
                returnPromiseResolve(false);
                if (promise) {
                    await promise;
                }
            };
        }
        // the indirection of promises here is to allow us to do additional work on listPromise's cancel
        listPromise
            .then(() => {
                state.loading = false;
                returnPromiseResolve(true);
            })
            .catch((error) => {
                state.loading = false;
                state.errored = true;
                state.error = error;
                returnPromiseResolve(false);
            });
        return returnPromise;
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

    const es = effectScope();

    es.run(() => {
        state.objectsInOrder = computed(() => Object.values(state.objects));
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
