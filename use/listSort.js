import { effectScope, onScopeDispose, reactive, toRef, unref, watch } from "vue";
import { cloneDeep, get, identity, isEmpty, isNull, isUndefined, partial, throttle, zip } from "lodash";
import { assignReactiveObject, keyDiff } from "../utils";

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
        sortCriteriaWatches: {},
        orderByDesc: [],
    });
    const es = effectScope();

    function removeSortCriteria(removedKey) {
        const stopWatches = state.sortCriteriaWatches[removedKey] || [];
        let stopWatch = stopWatches.pop();
        while (stopWatch) {
            stopWatch();
            stopWatch = stopWatches.pop();
        }
        delete state.sortCriteriaWatches[removedKey];
        delete state.sortCriteria[removedKey];
    }

    function addSortCriteria(object, key) {
        const oldStopWatches = state.sortCriteriaWatches[key] || [];
        let stopWatch = oldStopWatches.pop();
        while (stopWatch) {
            stopWatch();
            stopWatch = oldStopWatches.pop();
        }
        const stopWatches = [];
        if (!state.sortCriteria[key]) {
            state.sortCriteria[key] = [];
        }
        stopWatches.push(
            watch(
                [object, state.orderByRules],
                () => {
                    const newSearchCriteria = [];
                    for (const orderByObj of state.orderByRules.filter(identity)) {
                        const obo = unref(orderByObj);
                        const getter = obo.keyFn ? obo.keyFn : partial(get, partial.placeholder, obo.key);
                        newSearchCriteria.push(getter(object));
                    }
                    assignReactiveObject(state.sortCriteria[key], newSearchCriteria);
                },
                {
                    deep: true,
                    immediate: true,
                }
            )
        );
        state.sortCriteriaWatches[key] = stopWatches;
    }

    function sortCriteriaWatch() {
        if (!state.orderByRules || !state.orderByRules.filter(identity).length) {
            if (!isEmpty(state.sortCriteria)) {
                for (const removedKey of Object.keys(state.sortCriteria)) {
                    removeSortCriteria(removedKey);
                }
            }
            return;
        }
        const { removedKeys, addedKeys } = keyDiff(Object.keys(parentState.objects), Object.keys(state.sortCriteria));
        for (const removedKey of removedKeys) {
            removeSortCriteria(removedKey);
        }

        for (const addedKey of addedKeys) {
            const object = parentState.objects[addedKey];
            addSortCriteria(object, addedKey);
        }
        assignReactiveObject(
            state.orderByDesc,
            state.orderByRules.filter(identity).map((e) => e.desc || false)
        );
    }

    function sortWatch() {
        if (!state.orderByRules || !state.orderByRules.length) {
            const serverOrderObjectsInOrder = parentState.order.map((e) => parentState.objects[e]).filter(identity);
            assignReactiveObject(
                state.order,
                serverOrderObjectsInOrder.map((e) => String(e.id))
            );
            assignReactiveObject(state.objectsInOrder, serverOrderObjectsInOrder);
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
    }

    const throttledSortWatch = throttle(sortWatch, sortThrottleWait);

    es.run(() => {
        state.objects = toRef(parentState, "objects");
        // we do not need two immediate watches to the same function.
        watch(() => Object.keys(parentState.objects), sortCriteriaWatch);
        watch(() => cloneDeep(state.orderByRules), sortCriteriaWatch, {
            deep: true,
            immediate: true,
        });

        watch([toRef(state, "orderByDesc"), () => state.sortCriteria, () => parentState.order], throttledSortWatch, {
            deep: true,
        });
        onScopeDispose(() => {
            Object.keys(state.sortCriteriaWatches).forEach((key) => {
                removeSortCriteria(key);
            });
        });
    });

    return {
        state,
        parentState,
        effectScope: es,
    };
}
