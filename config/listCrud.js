import { addOrUpdateReactiveObject } from "../utils/index.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import isFunction from "lodash-es/isFunction.js";
import { isReactive, toRef } from "vue";

const defaultCrud = {
    args: {},
    list: undefined,
    subscribe: undefined,
};

export const setListCrud = ({ list, subscribe, args = {}, ...rest }) => {
    defaultCrud.list = list;
    defaultCrud.subscribe = subscribe;
    // defensive cloning
    Object.assign(defaultCrud.args, cloneDeep(args));
    if (Object.keys(rest).length) {
        throw new Error(`Unknown key(s) passed to setListCrud: ${Object.keys(rest).join(", ")}`);
    }
};

export const getListCrud = (reactiveCrud, { props, functions } = {}) => {
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
                throw Error(`Invalid function "${key}" for getListCrud: invalid key or not a function.`);
            }
        }
    }
};
