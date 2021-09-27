import { unref, watch } from "vue";
import { cloneDeep, get, identity, isEmpty, isNull, isUndefined, partial, throttle, zip } from "lodash";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import { keyDiff } from "../utils/keyDiff";

const collator = new Intl.Collator(undefined, { numeric: true });

export function useListSorts(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListSort({ listInstance: instances[key], ...value });
    }
}

export default function useListSort({ listInstance, orderByRules, sortThrottleWait = 100 }) {
    listInstance.state.orderByRules = orderByRules;
    listInstance.state.order = [];
    listInstance.state.objectsInOrder = [];
    listInstance.state.sortCriteria = {};
    listInstance.state.sortCriteriaWatches = {};
    listInstance.state.orderByDesc = [];

    function removeSortCriteria(removedKey) {
        const stopWatches = listInstance.state.sortCriteriaWatches[removedKey];
        if (stopWatches?.length) {
            for (const stopWatch of stopWatches) {
                if (stopWatch) {
                    stopWatch();
                }
            }
        }
        delete listInstance.state.sortCriteriaWatches[removedKey];
        delete listInstance.state.sortCriteria[removedKey];
    }

    function addSortCriteria(object, key) {
        if (listInstance.state.sortCriteriaWatches[key]) {
            for (const stopWatch of listInstance.state.sortCriteriaWatches[key]) {
                if (stopWatch) {
                    stopWatch();
                }
            }
        }
        const stopWatches = [];
        if (!listInstance.state.sortCriteria[key]) {
            listInstance.state.sortCriteria[key] = [];
        }
        stopWatches.push(
            watch(
                [object, listInstance.state.orderByRules],
                () => {
                    const newSearchCriteria = [];
                    for (const orderByObj of listInstance.state.orderByRules.filter(identity)) {
                        const obo = unref(orderByObj);
                        const getter = obo.keyFn ? obo.keyFn : partial(get, partial.placeholder, obo.key);
                        newSearchCriteria.push(getter(object));
                    }
                    assignReactiveObject(listInstance.state.sortCriteria[key], newSearchCriteria);
                },
                {
                    deep: true,
                    immediate: true,
                }
            )
        );
        listInstance.state.sortCriteriaWatches[key] = stopWatches;
    }

    function sortCriteriaWatch() {
        if (!listInstance.state.orderByRules || !listInstance.state.orderByRules.filter(identity).length) {
            if (!isEmpty(listInstance.state.sortCriteria)) {
                for (const removedKey of Object.keys(listInstance.state.sortCriteria)) {
                    removeSortCriteria(removedKey);
                }
            }
            return;
        }
        const { removedKeys, addedKeys } = keyDiff(
            Object.keys(listInstance.state.objects),
            Object.keys(listInstance.state.sortCriteria)
        );
        for (const removedKey of removedKeys) {
            removeSortCriteria(removedKey);
        }

        for (const addedKey of addedKeys) {
            const object = listInstance.state.objects[addedKey];
            addSortCriteria(object, addedKey);
        }
        assignReactiveObject(
            listInstance.state.orderByDesc,
            listInstance.state.orderByRules.filter(identity).map((e) => e.desc || false)
        );
    }

    // we dont need two immediate watches to the same function.
    watch(
        () => Object.keys(listInstance.state.objects),
        () => {
            sortCriteriaWatch();
        }
    );
    watch(
        () => cloneDeep(listInstance.state.orderByRules),
        () => {
            sortCriteriaWatch();
        },
        {
            deep: true,
            immediate: true,
        }
    );

    function sortWatch() {
        if (!listInstance.state.orderByRules || !listInstance.state.orderByRules.length) {
            const serverOrderObjectsInOrder = listInstance.state.serverOrder
                .map((e) => listInstance.state.objects[e])
                .filter(identity);
            assignReactiveObject(
                listInstance.state.order,
                serverOrderObjectsInOrder.map((e) => String(e.id))
            );
            assignReactiveObject(listInstance.state.objectsInOrder, serverOrderObjectsInOrder);
            return;
        }

        let idList = Object.keys(listInstance.state.objects);

        idList.sort((xKey, yKey) => {
            const xCriteria = listInstance.state.sortCriteria[xKey];
            const yCriteria = listInstance.state.sortCriteria[yKey];
            for (let [x, y, orderByObj] of zip(xCriteria, yCriteria, listInstance.state.orderByRules)) {
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
        assignReactiveObject(listInstance.state.order, idList);
        assignReactiveObject(
            listInstance.state.objectsInOrder,
            idList.map((e) => listInstance.state.objects[e]).filter(identity)
        );
    }

    const throttledSortWatch = throttle(sortWatch, sortThrottleWait);

    watch(
        [
            () => listInstance.state.orderByDesc,
            () => listInstance.state.sortCriteria,
            () => listInstance.state.serverOrder,
        ],
        throttledSortWatch,
        {
            deep: true,
        }
    );
}
