import { useListCalculated, listCalculatedFunctions } from "./listCalculated.js";
import { useListFilter, listFilterFunctions } from "./listFilter.js";
import { useListInstance, listInstanceFunctions } from "./listInstance.js";
import { useListRelated, listRelatedFunctions } from "./listRelated.js";
import { useListSort, listSortFunctions } from "./listSort.js";
import { useListSubscription, listSubscriptionFunctions } from "./listSubscription.js";
import { usePagedListInstance } from "./paginatedListInstance.js";
import { effectScope, reactive, shallowReactive, shallowReadonly, toRef } from "vue";

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

    if (!("listArgs" in props)) {
        console.error("listArgs not set, must be true for intendToList or intendToSubscribe to work.");
    }
    if (!("retrieveArgs" in props)) {
        console.error("retrieveArgs not set, must be true for intendToList or intendToSubscribe to work.");
    }

    const es = effectScope();

    es.run(() => {
        managed.listInstance = (paged ? usePagedListInstance : useListInstance)({
            props,
            functions,
            keepOldPages,
        });

        managed.listSubscription = useListSubscription({
            listInstance: managed.listInstance,
        });
        managed.listSubscription.state.intendToList = toRef(props, "intendToList");
        managed.listSubscription.state.intendToSubscribe = toRef(props, "intendToSubscribe");

        managed.listRelated = useListRelated({
            parentState: managed.listSubscription.state,
            relatedObjectsRules: toRef(props, "relatedObjectsRules"),
        });

        managed.listCalculated = useListCalculated({
            parentState: managed.listRelated.state,
            calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
        });

        managed.listFilter = useListFilter({
            parentState: managed.listCalculated.state,
            useTextSearch: toRef(props, "useTextSearch"),
            textSearchRules: toRef(props, "textSearchRules"),
            textSearchValue: toRef(props, "textSearchValue"),
            allowedValues: toRef(props, "allowedValues"),
            excludedValues: toRef(props, "excludedValues"),
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });

        managed.listSort = useListSort({
            parentState: managed.listFilter.state,
            orderByRules: toRef(props, "orderByRules"),
            sortThrottleWait: functions.sortThrottleWait,
        });
    });

    const clearError = (error) => {
        managed.listSubscription.clearError(error);
        managed.listInstance.clearError(error);
    };

    const returnObject = reactive({
        // we manage the keys on both of these, so hands off the root.
        managed: shallowReadonly(managed),
        state: managed.listSort.state,
        effectScope: es,
    });
    const handledDuplicateFunctions = {
        clearError,
    };
    for (const [source, fnNames] of [
        [managed.listInstance, listInstanceFunctions],
        [managed.listSubscription, listSubscriptionFunctions],
        [managed.listRelated, listRelatedFunctions],
        [managed.listCalculated, listCalculatedFunctions],
        [managed.listFilter, listFilterFunctions],
        [managed.listSort, listSortFunctions],
    ]) {
        for (const fnName of fnNames) {
            if (handledDuplicateFunctions[fnName]) {
                continue;
            }
            returnObject[fnName] = source[fnName];
        }
    }
    for (const [fnName, fn] of Object.entries(handledDuplicateFunctions)) {
        returnObject[fnName] = fn;
    }
    return returnObject;
};
