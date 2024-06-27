import { useListCalculated } from "./listCalculated.js";
import { useListFilter } from "./listFilter.js";
import { useListInstance } from "./listInstance.js";
import {
    listSortFunctions,
    listFilterFunctions,
    listRelatedFunctions,
    listCalculatedFunctions,
    listSubscriptionFunctions,
    listInstanceFunctions,
    listSearchFunctions,
} from "./listKeys.js";
import { useListRelated } from "./listRelated.js";
import { useListSearch } from "./listSearch.js";
import { useListSort } from "./listSort.js";
import { useListSubscription } from "./listSubscription.js";
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
export const useList = ({
    props,
    functions = {},
    paged = false,
    keepOldPages = false,
    clearListOnListIntentTriggered = false,
    searchThrottle = 500,
    sortThrottleWait,
    searchShowAllWhenEmpty,
}) => {
    const managed = shallowReactive({
        listInstance: null,
        listSubscription: null,
        listRelated: null,
        listCalculated: null,
        listFilter: null,
        listSearch: null,
        listSort: null,
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
            clearListOnListIntentTriggered,
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
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });

        managed.listSearch = useListSearch({
            parentState: managed.listFilter.state,
            props: reactive({
                textSearchRules: toRef(props, "textSearchRules"),
                textSearchValue: toRef(props, "textSearchValue"),
                customDocumentOptions: toRef(props, "customDocumentOptions"),
                customSearchOptions: toRef(props, "customSearchOptions"),
            }),
            throttle: searchThrottle,
            showAllWhenEmpty: searchShowAllWhenEmpty,
        });

        managed.listSort = useListSort({
            parentState: managed.listSearch.state,
            orderByRules: toRef(props, "orderByRules"),
            sortThrottleWait,
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
        [managed.listSearch, listSearchFunctions],
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
