import { isEmpty } from "lodash";
import { reactive, unref } from "vue";
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

export function setObjectInstanceCrud({ retrieve, create, update, patch, delete: deleteFn, args }) {
    defaultCrud.retrieve = retrieve;
    defaultCrud.create = create;
    defaultCrud.update = update;
    defaultCrud.patch = patch;
    defaultCrud.delete = deleteFn;
    assignReactiveObject(defaultCrud.args, args);
}

export default function useObjectInstance({ crudArgs, retrieveArgs }) {
    const state = reactive({
        crud: {},
        object: {},
        defaultRetrieveArgs: retrieveArgs,
        loading: undefined,
        errored: false,
        error: null,
        deleted: false,
    });
    assignReactiveObject(state.crud, defaultCrud);
    if (crudArgs) {
        assignReactiveObject(state.crud.args, crudArgs);
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
        return state.crud
            .retrieve({
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
        return state.crud
            .create({
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
        return state.crud
            .update({
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
        return state.crud
            .patch({
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
        return state.crud
            .delete(id)
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

    function updateFromSubscription(data) {
        assignReactiveObject(state.object, data);
    }

    return {
        state,
        retrieve,
        create,
        update,
        patch,
        delete: deleteFn,
        updateFromSubscription,
    };
}
