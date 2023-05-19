import { useListCalculated } from "./listCalculated";
import { useListInstance } from "./listInstance";
import { useListRelated } from "./listRelated";
import { useListSubscription } from "./listSubscription";
import { usePagedListInstance } from "./paginatedListInstance";
import { reactive, shallowReactive, shallowReadonly, toRef } from "vue";

export const useLists = (listArgs) => {
    const lists = {};
    for (const [key, value] of Object.entries(listArgs)) {
        lists[key] = useList(value);
    }
    return lists;
};

// the big brother of useObject, managing a chain of useList* instances.
export const useList = ({ props, functions, paged = false, keepOldPages = false }) => {
    const managed = shallowReactive({
        listInstance: null,
        listSubscription: null,
        listRelated: null,
        listCalculated: null,
    });

    managed.listInstance = (paged ? usePagedListInstance : useListInstance)({
        props,
        functions,
        keepOldPages,
    });

    managed.listSubscription = useListSubscription({
        listInstance: managed.listInstance,
    });
    managed.listSubscription.state.intendToList = toRef(props, "intendToList");

    managed.listRelated = useListRelated({
        parentState: managed.listSubscription.state,
        relatedObjectsRules: toRef(props, "relatedObjectsRules"),
    });

    managed.listCalculated = useListCalculated({
        parentState: managed.listRelated.state,
        calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
    });

    return reactive({
        // we manage the keys on both of these, so hands off the root.
        managed: shallowReadonly(managed),
        state: managed.listCalculated.state,
    });
};
