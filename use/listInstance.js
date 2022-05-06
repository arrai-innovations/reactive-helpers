import { isEmpty, keyBy } from "lodash";
import { effectScope, reactive, unref, watch } from "vue";
import { addOrUpdateReactiveObject, assignReactiveObject } from "../utils/assignReactiveObject";
import inspect from "browser-util-inspect";

export class ListError extends Error {
    constructor(message, code) {
        super(message);
        this.name = "ListError";
        this.code = code;
    }
}

const defaultCrud = reactive({
    args: {},
    list: undefined,
});

export function setListInstanceCrud({ list, args = {} } = {}) {
    defaultCrud.list = list;
    assignReactiveObject(defaultCrud.args, args);
}

export function useListInstances(listInstanceArgs) {
    const instances = {};
    for (const [key, value] of Object.entries(listInstanceArgs)) {
        instances[key] = useListInstance(value);
    }
    return instances;
}

export default function useListInstance({
    crudArgs,
    defaultListArgs = {},
    defaultRetrieveArgs = {},
    emit, // emit is not reactive
}) {
    const state = reactive({
        listInstanceCrud: {
            args: {},
            list: undefined,
        },
        defaultRetrieveArgs,
        defaultListArgs,
        objects: {},
        loading: undefined,
        errored: false,
        error: null,
    });
    assignReactiveObject(state.listInstanceCrud, defaultCrud);
    if (crudArgs) {
        assignReactiveObject(state.listInstanceCrud.args, crudArgs);
    }

    async function list({ listArgs, retrieveArgs } = {}) {
        if (state.loading) {
            throw new ListError("already loading.");
        }
        if (isEmpty(retrieveArgs) && !isEmpty(unref(state.defaultRetrieveArgs))) {
            retrieveArgs = unref(state.defaultRetrieveArgs);
        }
        if (isEmpty(listArgs) && !isEmpty(unref(state.defaultListArgs))) {
            listArgs = unref(state.defaultListArgs);
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.listInstanceCrud
            .list({
                crudArgs: state.listInstanceCrud.args,
                retrieveArgs,
                listArgs,
                pageCallback: (newObjects) => {
                    addOrUpdateReactiveObject(state.objects, keyBy(newObjects, "id"));
                },
            })
            .then(() => {
                return Promise.resolve(true);
            })
            .catch((error) => {
                state.errored = true;
                state.error = error;
                return Promise.resolve(false);
            })
            .finally(() => {
                state.loading = false;
            });
    }

    function addListObject(object) {
        if (!object.id) {
            throw new ListError(`addListObject: object missing id.\n${inspect(object)}`, "missing-id");
        }
        if (object.id in state.objects) {
            throw new ListError(`addListObject: list already has object for id: ${inspect(object.id)}`, "duplicate-id");
        }
        state.objects[object.id] = {};
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
        delete state.objects[objectId];
    }

    function getFakeId() {
        let fakeId;
        do {
            fakeId = Math.floor(Math.random() * Number.MIN_SAFE_INTEGER);
        } while (fakeId in state.objects);
        return fakeId;
    }

    const es = effectScope();

    es.run(() => {
        if (emit) {
            watch(
                () => state.errored,
                (newErrored) => {
                    emit("errored", newErrored);
                }
            );
            watch(
                () => state.loading,
                (newLoading) => {
                    emit("loading", newLoading);
                }
            );
        }
    });

    return {
        combinedState: state,
        state,
        list,
        addListObject,
        updateListObject,
        deleteListObject,
        effectScope: es,
        getFakeId,
    };
}
