import { unref, watch } from "vue";
import { cloneDeep, get, identity, isEmpty, partial, throttle } from "lodash";
import { assignReactiveObject } from "../utils/assignReactiveObject";
import { keyDiff } from "../utils/keyDiff";

export function useListFilters(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListFilter({ listInstance: instances[key], ...value });
    }
}

export default function useListFilter({ listInstance, filterRules, filterThrottleWait = 100 }) {
    listInstance.state.filterRules = filterRules;
    listInstance.state.filterCriteria = {};
    listInstance.state.filterCriteriaWatches = {};

    function removeFilterCriteria(removedKey) {
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

    function addFilterCriteria(object, key) {
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

    function filterCriteriaWatch() {
        if (!listInstance.state.orderByRules || !listInstance.state.orderByRules.filter(identity).length) {
            if (!isEmpty(listInstance.state.sortCriteria)) {
                for (const removedKey of Object.keys(listInstance.state.sortCriteria)) {
                    removeFilterCriteria(removedKey);
                }
            }
            return;
        }
        const { removedKeys, addedKeys } = keyDiff(
            Object.keys(listInstance.state.objects),
            Object.keys(listInstance.state.sortCriteria)
        );
        for (const removedKey of removedKeys) {
            removeFilterCriteria(removedKey);
        }

        for (const addedKey of addedKeys) {
            const object = listInstance.state.objects[addedKey];
            addFilterCriteria(object, addedKey);
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
            filterCriteriaWatch();
        }
    );
    watch(
        () => cloneDeep(listInstance.state.filterRules),
        () => {
            filterCriteriaWatch();
        },
        {
            deep: true,
            immediate: true,
        }
    );

    function filterWatch() {
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

        // filter idList

        assignReactiveObject(listInstance.state.order, idList);
        assignReactiveObject(
            listInstance.state.objectsInOrder,
            idList.map((e) => listInstance.state.objects[e]).filter(identity)
        );
    }

    const throttledFilterWatch = throttle(filterWatch, filterThrottleWait);

    watch(
        [
            () => listInstance.state.orderByDesc,
            () => listInstance.state.sortCriteria,
            () => listInstance.state.serverOrder,
        ],
        throttledFilterWatch,
        {
            deep: true,
        }
    );
}
