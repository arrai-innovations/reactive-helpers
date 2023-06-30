import { addOrUpdateReactiveObject, assignReactiveObject } from "../utils/index.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { reactive, toRef } from "vue";

export class ObjectError extends Error {
    constructor(message) {
        super(message);
        this.name = "ObjectError";
    }
}

const defaultCrud = {
    args: {},
    retrieve: undefined,
    create: undefined,
    update: undefined,
    patch: undefined,
    delete: undefined,
};

export function setObjectInstanceCrud({ retrieve, create, update, patch, delete: deleteFn, args = {} }) {
    defaultCrud.retrieve = retrieve;
    defaultCrud.create = create;
    defaultCrud.update = update;
    defaultCrud.patch = patch;
    defaultCrud.delete = deleteFn;
    Object.assign(defaultCrud.args, args);
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
            retrieve: undefined,
            create: undefined,
            update: undefined,
            patch: undefined,
            delete: undefined,
        },
        object: {},
        id: toRef(props, "id"),
        retrieveArgs: toRef(props, "retrieveArgs"),
        loading: undefined,
        errored: false,
        error: null,
        deleted: false,
    });
    // prevent linking of all instances to the same default .args object
    Object.assign(state.crud, cloneDeep(defaultCrud));
    if (props.crudArgs) {
        addOrUpdateReactiveObject(state.crud.args, props.crudArgs);
    }
    for (const [key, value] of Object.entries(functions)) {
        if (isFunction(value) && key in state.crud) {
            state[key] = value;
        } else {
            throw ObjectError(`Invalid function "${key}" for useObjectInstance: invalid key or not a function.`);
        }
    }

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

    return reactive({
        state,
        retrieve,
        create,
        update,
        patch,
        delete: deleteFn,
        clearError,
    });
}
