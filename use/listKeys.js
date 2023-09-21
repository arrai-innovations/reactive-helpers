export const listInstanceStateKeys = [
    "crud",
    "retrieveArgs",
    "listArgs",
    "objects",
    "loading",
    "errored",
    "error",
    "objectsInOrder",
    "objectsInOrderRefs",
    "order",
    // when paged
    "totalRecords",
    "totalPages",
    "perPage",
];
export const listInstanceFunctions = [
    "list",
    "addListObject",
    "updateListObject",
    "deleteListObject",
    "clearList",
    "clearError",
    "getFakeId",
    "defaultPageCallback",
    "pageCallback",
];

export const listSubscriptionStateKeys = [
    "subscriptionLoading",
    "subscriptionErrored",
    "subscriptionError",
    "intendToList",
    "intendToSubscribe",
    "subscribed",
];
export const listSubscriptionFunctions = ["subscribe", "unsubscribe", "clearError"];

export const listRelatedStateKeys = [
    "relatedObjects",
    "relatedObjectsRules",
    "relatedObjectsWatchRunning",
    "relatedObjectsParentStateObjectsWatchRunning",
    "running",
    "objAndKeyForIdAndRule",
    "fkForIdAndRule",
];
export const listRelatedFunctions = [];

export const listCalculatedStateKeys = [
    "calculatedObjects",
    "calculatedObjectsParentStateObjectsWatchRunning",
    "calculatedObjectsRules",
    "calculatedObjectsWatchRunning",
    "running",
];
export const listCalculatedFunctions = [];

export const listFilterStateKeys = [
    "allowedFilter",
    "excludedFilter",
    "inResults",
    "objects",
    "objectsInOrder",
    "objectsInOrderRefs",
    "objectsWatchRunning",
    "order",
    "resultsWatchRunning",
    "running",
];
export const listFilterFunctions = [];

export const listSearchStateKeys = [
    "objectIndexes",
    "objects",
    "order",
    "objectsInOrder",
    "objectsInOrderRefs",
    "textSearchRules",
    "textSearchValue",
    "searched",
    "updateSearchIndexesRunning",
    "customDocumentOptions",
    "customSearchOptions",
    "running",
    "newSearchComputeds",
];
export const listSearchFunctions = [];
export const listSortStateKeys = [
    "orderByRules",
    "order",
    "objectsInOrder",
    "objectsInOrderRefs",
    "sortCriteria",
    "orderByDesc",
    "sortCriteriaWatchRunning",
    "sortWatchRunning",
    "outstandingEffects",
    "running",
];
export const listSortFunctions = [];
