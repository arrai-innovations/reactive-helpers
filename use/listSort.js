import { assignReactiveObject, difference, keyDiff, loadingCombine } from "../utils/index.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import {
    listCalculatedStateKeys,
    listFilterStateKeys,
    listInstanceStateKeys,
    listRelatedStateKeys,
    listSearchStateKeys,
    listSortStateKeys,
    listSubscriptionStateKeys,
} from "./listKeys.js";
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isEmpty from "lodash-es/isEmpty.js";
import isEqual from "lodash-es/isEqual.js";
import isNull from "lodash-es/isNull.js";
import isUndefined from "lodash-es/isUndefined.js";
import throttle from "lodash-es/throttle.js";
import zip from "lodash-es/zip.js";
import { computed, effectScope, reactive, ref, toRef, unref, watch } from "vue";

const collator = new Intl.Collator(undefined, { numeric: true });

const defaultSortThrottleWait = Symbol("defaultSortThrottleWait");

const defaultOptions = {
    sortThrottleWait: 100,
};

const parentStateKeys = difference(
    new Set([
        ...listInstanceStateKeys,
        ...listSubscriptionStateKeys,
        ...listRelatedStateKeys,
        ...listCalculatedStateKeys,
        ...listFilterStateKeys,
        ...listSearchStateKeys,
    ]),
    new Set(listSortStateKeys)
);

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
    const sortThrottleWaitNumber = (() => {
        if (sortThrottleWait === defaultSortThrottleWait) {
            return defaultOptions.sortThrottleWait;
        }
        return Number(sortThrottleWait);
    })();

    const sortCriteriaEffectScopes = {};

    const internalState = reactive({
        objectsInOrderRefs: [],
    })
    const state = reactive({
        orderByRules,
        order: [],
        objectsInOrder: [],
        sortCriteria: {},
        orderByDesc: [],
        sortCriteriaWatchRunning: false,
        sortWatchRunning: false,
        outstandingEffects: false,
    });
    const es = effectScope();

    function removeSortCriteria(removedKey) {
        const oldScope = sortCriteriaEffectScopes[removedKey];
        if (oldScope) {
            oldScope.stop();
            delete sortCriteriaEffectScopes[removedKey];
        }
        delete state.sortCriteria[removedKey];
    }

    function addSortCriteria(object, relatedObject, calculatedObject, key) {
        const oldScope = sortCriteriaEffectScopes[key];
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
        sortCriteriaEffectScopes[key] = newScope;
    }

    function sortCriteriaWatch() {
        try {
            if (!state.orderByRules?.length || !state.orderByRules.filter(identity).length) {
                if (!isEmpty(state.sortCriteria)) {
                    for (const removedKey of Object.keys(state.sortCriteria)) {
                        removeSortCriteria(removedKey);
                    }
                }
                state.order = [...parentState.order];
                assignReactiveObject(
                    internalState.objectsInOrderRefs,
                    state.order.map((e) => toRef(parentState.objects, e))
                );
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
                    const object = toRef(parentState.objects, addedKey);
                    const relatedObj = toRef(parentState.relatedObjects, addedKey);
                    const calculatedObj = toRef(parentState.calculatedObjects, addedKey);
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
            if (!state.orderByRules?.length) {
                state.order = [...parentState.order];
                assignReactiveObject(
                    internalState.objectsInOrderRefs,
                    state.order.map((e) => toRef(parentState.objects, e))
                );
                return;
            }
            let idList = [...parentState.order];
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
            state.order = idList;
            assignReactiveObject(
                internalState.objectsInOrderRefs,
                idList.map((e) => toRef(parentState.objects, e))
            );
        } finally {
            state.sortWatchRunning = false;
            state.outstandingEffects = false;
        }
    }

    const throttledSortWatch = throttle(sortWatch, sortThrottleWaitNumber);

    let watchesRunning = null;

    es.run(() => {
        for (const key of parentStateKeys) {
            state[key] = toRef(parentState, key);
        }
        // this watch must come first or be immediate.
        watch([toRef(state, "orderByDesc"), toRef(state, "sortCriteria")], throttledSortWatch, {
            deep: true,
        });
        watch([toRef(state, "orderByRules"), toRef(parentState, "order")], sortCriteriaWatch, {
            deep: true,
            immediate: true,
        });
        watchesRunning = useWatchesRunning({
            triggerRefs: [
                computed(() => (state.orderByRules && !isEmpty(state.orderByRules) ? parentState.loading : false)),
            ],
            watchSentinelRefs: [toRef(state, "sortCriteriaWatchRunning"), toRef(state, "sortWatchRunning")],
        });

        state.objectsInOrder = computed(() => internalState.objectsInOrderRefs.map((e) => unref(e)));
        state.sortRunning = computed(() => loadingCombine(watchesRunning.state.running, state.outstandingEffects));
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        state.running = computed(() =>
            loadingCombine(watchesRunning.state.running, state.outstandingEffects, parentRunning.value)
        );
    });

    return {
        state,
        parentState,
        effectScope: es,
        watchesRunning,
    };
}
