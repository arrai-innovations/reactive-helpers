import { getObjectCrud } from "../config/objectCrud.js";
import { assignReactiveObject } from "../utils/index.js";
import { reactive, toRef } from "vue";

export class ObjectError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectError";
    }
}

export function useObjectInstances(instanceArgs) {
    const instances = {};
    for (const [key, value] of Object.entries(instanceArgs)) {
        instances[key] = useObjectInstance(value);
    }
    return instances;
}

export function useObjectInstance({ props, functions = {} }) {
    const state = reactive({
        crud: {
            args: {},
            create: undefined,
            retrieve: undefined,
            update: undefined,
            delete: undefined,
            patch: undefined,
        },
        object: {},
        id: toRef(props, "id"),
        retrieveArgs: toRef(props, "retrieveArgs"),
        loading: undefined,
        errored: false,
        error: null,
        deleted: false,
    });

    getObjectCrud(state.crud, { props, functions });

    // due to retrieve being called by `useCancelleableIntent`, if called manually then by the watch,
    //  it will run into the loading check. Instead, return the current retrieve promise if it exists.
    const promises = {
        retrieve: null,
    };

    function retrieve() {
        // this function cannot be async, or the resulting promise will lose its .cancel() method
        if (promises.retrieve) {
            // if a retrieve is already in progress, return the existing promise
            return promises.retrieve;
        }
        if (state.loading) {
            // if another operation is already in progress, return a rejected promise
            return Promise.reject(new ObjectError("already loading."));
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        promises.retrieve = state.crud
            .retrieve({
                crudArgs: state.crud.args,
                id: state.id,
                retrieveArgs: state.retrieveArgs,
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
                promises.retrieve = null;
            });
        return promises.retrieve;
    }

    async function create({ object }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.crud
            .create({
                crudArgs: state.crud.args,
                object,
                retrieveArgs: state.retrieveArgs,
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

    async function update({ object }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.crud
            .update({
                crudArgs: state.crud.args,
                object,
                retrieveArgs: state.retrieveArgs,
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

    async function patch({ partialObject }) {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.crud
            .patch({
                crudArgs: state.crud.args,
                id: state.id,
                partialObject,
                retrieveArgs: state.retrieveArgs,
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

    async function deleteFn() {
        if (state.loading) {
            throw new ObjectError("already loading.");
        }
        state.loading = true;
        state.errored = false;
        state.error = null;
        return state.crud
            .delete({
                crudArgs: state.crud.args,
                id: state.id,
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

    function clearError() {
        state.errored = false;
        state.error = null;
    }

    function clear() {
        clearError();
        assignReactiveObject(state.object, {});
    }

    return reactive({
        state,
        retrieve,
        create,
        update,
        patch,
        delete: deleteFn,
        clearError,
        clear,
    });
}
