import { cloneDeep } from "lodash";
import { computed, effectScope, reactive } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import { getFakeId } from "../utils/getFakeId";
import inspect from "browser-util-inspect";

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
    const state = reactive({
        crud: {
            args: {},
            list: undefined,
        },
        retrieveArgs,
        listArgs,
        objects: {},
        loading: undefined,
        errored: false,
        error: null,
        order: [],
    });
    // prevent linking of all instances to the same default .args object
    Object.assign(state.crud, cloneDeep(defaultCrud));
    if (crudArgs) {
        assignReactiveObject(state.crud.args, crudArgs);
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
        state.objects[object.id] = {};
        // objects keys are always strings.
        state.order.push(`${object.id}`);
        assignReactiveObject(state.objects[object.id], object);
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
        // objects keys are always strings.
        state.order.splice(state.order.indexOf(`${objectId}`), 1);
        delete state.objects[objectId];
    }

    function clearList() {
        state.order.splice(0);
        for (const item in state.objects) {
            delete state.objects[item];
        }
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
        state.objectsInOrder = computed(() => state.order.map((id) => state.objects[id]));
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
