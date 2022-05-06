import { isEmpty } from "lodash";
import { effectScope, reactive, unref, watch } from "vue";
import { assignReactiveObject } from "../utils/assignReactiveObject";

export class ObjectError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectError";
    }
}

const defaultCrud = reactive({
    args: {},
    retrieve: undefined,
    create: undefined,
    update: undefined,
    patch: undefined,
    delete: undefined,
});

export function setObjectInstanceCrud({ retrieve, create, update, patch, delete: deleteFn, args = {} }) {
    defaultCrud.retrieve = retrieve;
    defaultCrud.create = create;
    defaultCrud.update = update;
    defaultCrud.patch = patch;
    defaultCrud.delete = deleteFn;
    assignReactiveObject(defaultCrud.args, args);
}

export function useObjectInstances(instanceArgs) {
    const instances = {};
    for (const [key, value] of Object.entries(instanceArgs)) {
        instances[key] = useObjectInstance(value);
    }
    return instances;
}

export default function useObjectInstance({ crudArgs, retrieveArgs, emit }) {
    const state = reactive({
        objectInstanceCrud: {
            args: {},
            retrieve: undefined,
            create: undefined,
            update: undefined,
            patch: undefined,
            delete: undefined,
        },
        object: {},
        defaultRetrieveArgs: retrieveArgs,
        loading: undefined,
        errored: false,
        error: null,
        deleted: false,
    });
    assignReactiveObject(state.objectInstanceCrud, defaultCrud);
    if (crudArgs) {
        assignReactiveObject(state.objectInstanceCrud.args, crudArgs);
    }

    async function retrieve({ id, ...retrieveArgs }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        if (isEmpty(retrieveArgs) && !isEmpty(unref(state.defaultRetrieveArgs))) {
            retrieveArgs = unref(state.defaultRetrieveArgs);
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.objectInstanceCrud
            .retrieve({
                crudArgs: state.objectInstanceCrud.args,
                id,
                retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
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

    async function create({ object, ...retrieveArgs }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        if (isEmpty(retrieveArgs) && !isEmpty(unref(state.defaultRetrieveArgs))) {
            retrieveArgs = unref(state.defaultRetrieveArgs);
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.objectInstanceCrud
            .create({
                crudArgs: state.objectInstanceCrud.args,
                object,
                retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
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

    async function update({ object, ...retrieveArgs }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        if (isEmpty(retrieveArgs) && !isEmpty(unref(state.defaultRetrieveArgs))) {
            retrieveArgs = unref(state.defaultRetrieveArgs);
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.objectInstanceCrud
            .update({
                crudArgs: state.objectInstanceCrud.args,
                object,
                retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
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

    async function patch({ id, partialObject, ...retrieveArgs }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        if (isEmpty(retrieveArgs) && !isEmpty(unref(state.defaultRetrieveArgs))) {
            retrieveArgs = unref(state.defaultRetrieveArgs);
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.objectInstanceCrud
            .patch({
                crudArgs: state.objectInstanceCrud.args,
                id,
                partialObject,
                retrieveArgs,
            })
            .then((object) => {
                assignReactiveObject(state.object, object);
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

    async function deleteFn(id) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.objectInstanceCrud
            .delete({
                crudArgs: state.objectInstanceCrud.args,
                id,
            })
            .then(() => {
                state.deleted = true;
                assignReactiveObject(state.object, {});
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
        state,
        retrieve,
        create,
        update,
        patch,
        delete: deleteFn,
        effectScope: es,
    };
}
