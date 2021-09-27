import { isEmpty } from "lodash";
import { reactive, unref, watch } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";

export class ListError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListError";
    }
}

const defaultCrud = reactive({
    args: {},
    list: undefined,
});

export function setListInstanceCrud({ list, args }) {
    defaultCrud.list = list;
    assignReactiveObject(defaultCrud.args, args);
}

export function useListInstances(args) {
    const instances = {};
    for (const [key, value] of Object.entries(args)) {
        instances[key] = useListInstance(value);
    }
    return instances;
}

export default function useListInstance({ crudArgs, defaultListArgs = {}, defaultRetrieveArgs = {}, emit }) {
    const state = reactive({
        crud: {
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
    assignReactiveObject(state.crud, defaultCrud);
    if (crudArgs) {
        assignReactiveObject(state.crud.args, crudArgs);
    }

    async function list({ listArgs, retrieveArgs }) {
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
        return state.crud
            .list({
                crudArgs: state.crud.args,
                retrieveArgs,
                listArgs,
                pageCallback: (newObjects) => {
                    for (const newObject of newObjects) {
                        updateFromSubscription(newObject);
                    }
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

    function addFromSubscription(data) {
        if (!data.id) {
            throw ListError("addFromSubscription: data missing id.");
        }
        if (!(data.id in state.objects)) {
            state.objects[data.id] = data;
        } else {
            throw ListError("addFromSubscription: add for existing data.");
        }
    }

    function updateFromSubscription(data) {
        if (!data.id) {
            throw ListError("updateFromSubscription: data missing id.");
        }
        if (data.id in state.objects) {
            state.objects[data.id] = data;
        } else {
            throw ListError("updateFromSubscription: update for missing data.");
        }
    }

    function deleteFromSubscription(id) {
        if (!id) {
            throw ListError("deleteFromSubscription: id required.");
        }
        if (id in state.objects) {
            delete state.objects[id];
        } else {
            throw ListError("deleteFromSubscription: delete for missing data.");
        }
    }

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

    return {
        state,
        list,
        addFromSubscription,
        updateFromSubscription,
        deleteFromSubscription,
    };
}
