import { assignReactiveObject, keyDiff, loadingCombine } from "../utils/index.js";
import { listCalculatedStateKeys } from "./listCalculated.js";
import { listFilterStateKeys } from "./listFilter.js";
import { listInstanceStateKeys } from "./listInstance.js";
import { listRelatedStateKeys } from "./listRelated.js";
import { listSubscriptionStateKeys } from "./listSubscription.js";
import { useWatchesRunning } from "./watchesRunning.js";
import cloneDeep from "lodash-es/cloneDeep.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import isNull from "lodash-es/isNull.js";
import isUndefined from "lodash-es/isUndefined.js";
import throttle from "lodash-es/throttle.js";
import zip from "lodash-es/zip.js";
import { effectScope, reactive, toRef, unref, watch, computed } from "vue";

export const listSortStateKeys = [
    "orderByRules",
    // "order",
    // "objectsInOrder",
    "sortCriteria",
    "sortCriteriaEffectScopes",
    "orderByDesc",
    "sortCriteriaWatchRunning",
    "sortWatchRunning",
    "outstandingEffects",
    // "running",
];

export const listSortFunctions = [];

const collator = new Intl.Collator(undefined, { numeric: true });

const defaultSortThrottleWait = Symbol("defaultSortThrottleWait");

const defaultOptions = {
    sortThrottleWait: 100,
};

export function setListSortDefaultOptions({ sortThrottleWait }) {
    defaultOptions.sortThrottleWait = sortThrottleWait;
}

export function useListSorts(args, parentInstances) {
    const sorts = {};
    for (const [key, value] of Object.entries(args)) {
        sorts[key] = useListSort({ parentState: parentInstances[key].state || parentInstances[key], ...value });
    }
    return sorts;
}

export function useListSort({ parentState, orderByRules, sortThrottleWait = defaultSortThrottleWait }) {
    if (sortThrottleWait === defaultSortThrottleWait) {
        sortThrottleWait = defaultOptions.sortThrottleWait;
    }
    const state = reactive({
        orderByRules,
        order: [],
        objectsInOrder: [],
        sortCriteria: {},
        sortCriteriaEffectScopes: {},
        orderByDesc: [],
        sortCriteriaWatchRunning: false,
        sortWatchRunning: false,
        outstandingEffects: false,
    });
    const es = effectScope();

    function removeSortCriteria(removedKey) {
        const oldScope = state.sortCriteriaEffectScopes[removedKey];
        if (oldScope) {
            oldScope.stop();
            delete state.sortCriteriaEffectScopes[removedKey];
        }
        delete state.sortCriteria[removedKey];
    }

    function addSortCriteria(object, relatedObject, calculatedObject, key) {
        const oldScope = state.sortCriteriaEffectScopes[key];
        if (oldScope) {
            oldScope.stop();
        }
        const newScope = effectScope();
        newScope.run(() => {
            if (!state.sortCriteria[key]) {
                state.sortCriteria[key] = [];
            }
            watch(
                [object, relatedObject, calculatedObject, toRef(state, "orderByRules")],
                () => {
                    const obj = unref(object);
                    const relatedObj = unref(relatedObject);
                    const calculatedObj = unref(calculatedObject);
                    const newSearchCriteria = [];
                    for (const orderByObj of state.orderByRules.filter(identity)) {
                        let newItem;
                        if (orderByObj.keyFn) {
                            newItem = orderByObj.keyFn(obj, state);
                        } else {
                            if (orderByObj.key.startsWith("relatedItem.")) {
                                newItem = get(relatedObj, orderByObj.key.slice(12));
                            } else if (orderByObj.key.startsWith("calculatedItem.")) {
                                newItem = get(calculatedObj, orderByObj.key.slice(15));
                            } else {
                                newItem = get(obj, orderByObj.key);
                            }
                        }
                        newSearchCriteria.push(newItem);
                    }
                    if (isEqual(newSearchCriteria, state.sortCriteria[key])) {
                        return;
                    }
                    assignReactiveObject(state.sortCriteria[key], newSearchCriteria);
                    if (!state.outstandingEffects) {
                        state.outstandingEffects = true;
                    }
                },
                {
                    deep: true,
                    immediate: true,
                }
            );
        });
        state.sortCriteriaEffectScopes[key] = newScope;
    }

    function sortCriteriaWatch() {
        try {
            if (!state.orderByRules || !state.orderByRules.filter(identity).length) {
                if (!isEmpty(state.sortCriteria)) {
                    for (const removedKey of Object.keys(state.sortCriteria)) {
                        removeSortCriteria(removedKey);
                    }
                }
                assignReactiveObject(state.order, cloneDeep(parentState.order));
                assignReactiveObject(state.objectsInOrder, cloneDeep(parentState.objectsInOrder));
                return;
            }
            const { removedKeys, addedKeys } = keyDiff(
                Object.keys(parentState.objects),
                Object.keys(state.sortCriteria)
            );
            for (const removedKey of removedKeys) {
                removeSortCriteria(removedKey);
            }

            es.run(() => {
                for (const addedKey of addedKeys) {
                    const object = toRef(() => parentState.objects[addedKey]);
                    const relatedObj = toRef(() => parentState.relatedObjects?.[addedKey]);
                    const calculatedObj = toRef(() => parentState.calculatedObjects?.[addedKey]);
                    addSortCriteria(object, relatedObj, calculatedObj, addedKey);
                }
            });
            assignReactiveObject(
                state.orderByDesc,
                state.orderByRules.filter(identity).map((e) => e.desc || false)
            );
        } finally {
            state.sortCriteriaWatchRunning = false;
        }
    }

    function sortWatch() {
        try {
            if (!state.orderByRules || !state.orderByRules.length) {
                assignReactiveObject(state.order, cloneDeep(parentState.order));
                assignReactiveObject(state.objectsInOrder, cloneDeep(parentState.objectsInOrder));
                return;
            }

            let idList = Object.keys(parentState.objects);
            idList.sort((xKey, yKey) => {
                const xCriteria = state.sortCriteria[xKey];
                const yCriteria = state.sortCriteria[yKey];
                for (let [x, y, orderByObj] of zip(xCriteria, yCriteria, state.orderByRules)) {
                    if (!orderByObj) {
                        continue;
                    }
                    if (orderByObj.desc) {
                        [x, y] = [y, x];
                    }
                    const isUndefinedX = isUndefined(x) || isNull(x);
                    const isUndefinedY = isUndefined(y) || isNull(y);
                    if (isUndefinedX && isUndefinedY) {
                        continue;
                    } else if (isUndefinedX) {
                        return -1;
                    } else if (isUndefinedY) {
                        return 1;
                    }
                    if (orderByObj.localeCompare) {
                        const strComp = collator.compare(x, y);
                        if (strComp) {
                            return strComp;
                        }
                    } else {
                        if (x < y) {
                            return -1;
                        }
                        if (x > y) {
                            return 1;
                        }
                    }
                }
                return 0;
            });
            assignReactiveObject(state.order, idList);
            assignReactiveObject(state.objectsInOrder, idList.map((e) => parentState.objects[e]).filter(identity));
        } finally {
            state.sortWatchRunning = false;
            state.outstandingEffects = false;
        }
    }

    const throttledSortWatch = throttle(sortWatch, sortThrottleWait);

    let watchesRunning = null;

    es.run(() => {
        for (const key of listInstanceStateKeys) {
            if (["order", "objectsInOrder"].includes(key)) {
                continue;
            }
            state[key] = toRef(parentState, key);
        }
        for (const key of listSubscriptionStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of listRelatedStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of listCalculatedStateKeys) {
            state[key] = toRef(parentState, key);
        }
        for (const key of listFilterStateKeys) {
            state[key] = toRef(parentState, key);
        }
        // this watch must come first or be immediate.
        watch([toRef(state, "orderByDesc"), toRef(state, "sortCriteria")], throttledSortWatch, {
            deep: true,
        });
        // we do not need two immediate watches to the same function.
        watch(() => Object.keys(parentState.objects), sortCriteriaWatch);
        watch(toRef(state, "orderByRules"), sortCriteriaWatch, {
            deep: true,
            immediate: true,
        });
        watchesRunning = useWatchesRunning({
            triggerRefs: [
                computed(() => (state.orderByRules && !isEmpty(state.orderByRules) ? parentState.loading : false)),
            ],
            watchSentinelRefs: [toRef(state, "sortCriteriaWatchRunning"), toRef(state, "sortWatchRunning")],
        });

        state.sortRunning = computed(() => loadingCombine(watchesRunning.state.running, state.outstandingEffects));
        state.running = computed(() =>
            loadingCombine(watchesRunning.state.running, state.outstandingEffects, parentState.running)
        );
    });

    return {
        state,
        parentState,
        effectScope: es,
        watchesRunning,
    };
}
