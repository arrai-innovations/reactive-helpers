import { addOrUpdateReactiveObject } from "../utils/index.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, toRef } from "vue";

const defaultCrud = {
    args: {},
    retrieve: undefined,
    create: undefined,
    update: undefined,
    patch: undefined,
    delete: undefined,
    subscribe: undefined,
};

export const setObjectCrud = ({ retrieve, create, update, patch, delete: deleteFn, subscribe, args = {}, ...rest }) => {
    defaultCrud.retrieve = retrieve;
    defaultCrud.create = create;
    defaultCrud.update = update;
    defaultCrud.patch = patch;
    defaultCrud.delete = deleteFn;
    defaultCrud.subscribe = subscribe;
    // defensive cloning
    Object.assign(defaultCrud.args, cloneDeep(args));
    if (Object.keys(rest).length) {
        throw new Error(`Unknown key(s) passed to setObjectCrud: ${Object.keys(rest).join(", ")}`);
    }
};

export const getObjectCrud = (reactiveCrud, { props, functions } = {}) => {
    // don't mutate the default crud
    Object.assign(reactiveCrud, cloneDeep(defaultCrud));
    if (props?.crudArgs) {
        addOrUpdateReactiveObject(reactiveCrud.args, props.crudArgs);
    }
    if (functions) {
        for (const [key, value] of Object.entries(functions)) {
            if (isFunction(value) && key in reactiveCrud) {
                reactiveCrud[key] = isReactive(functions) ? toRef(functions, key) : value;
            } else {
                throw Error(`Invalid function "${key}" for getObjectCrud: invalid key or not a function.`);
            }
        }
    }
};
