import { bench, describe } from "vitest";
import { nextTick, reactive, toRef } from "vue";
import { useListCalculated } from "../../use/listCalculated.js";
import { useListFilter } from "../../use/listFilter.js";
import { useListInstance } from "../../use/listInstance.js";
import { useListRelated } from "../../use/listRelated.js";
import { useListSearch } from "../../use/listSearch.js";
import { useListSort } from "../../use/listSort.js";
import { benchmarkOptions, makeRichRows, populatedRules } from "./fixtures.js";

// Layer attribution. useList always composes every layer, so a list that needs none of them still
// pays for all of them. Building the stack one layer at a time shows what each contributes to the
// cost of inserting a page, which is what tells you whether a cost belongs to the base collection or
// to a specific layer.
const rowCount = 1000;
const rows = makeRichRows(rowCount);

const layers = ["instance", "related", "calculated", "filter", "search", "sort"];

/**
 * Compose the list stack up to and including `upTo`, mirroring the order used by useList.
 *
 * @param {string} upTo - Name of the last layer to build.
 * @returns {{push: (objects: object[]) => void, stop: () => void}} - Push entry point and teardown.
 */
const composeUpTo = (upTo) => {
    const included = layers.slice(0, layers.indexOf(upTo) + 1);
    const props = reactive({
        customDocumentOptions: {},
        customSearchOptions: {},
        intendToList: false,
        intendToSubscribe: false,
        params: {},
        pkKey: "id",
        target: {},
        ...populatedRules,
    });
    const built = [];

    const listInstance = useListInstance({ props, handlers: {} });
    built.push(listInstance);
    let state = listInstance.state;

    if (included.includes("related")) {
        const layer = useListRelated({ parentState: state, relatedObjectsRules: toRef(props, "relatedObjectsRules") });
        built.push(layer);
        state = layer.state;
    }
    if (included.includes("calculated")) {
        const layer = useListCalculated({
            parentState: state,
            calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
        });
        built.push(layer);
        state = layer.state;
    }
    if (included.includes("filter")) {
        const layer = useListFilter({
            parentState: state,
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });
        built.push(layer);
        state = layer.state;
    }
    if (included.includes("search")) {
        const layer = useListSearch({ parentState: state, props });
        built.push(layer);
        state = layer.state;
    }
    if (included.includes("sort")) {
        const layer = useListSort({
            parentState: state,
            orderByRules: toRef(props, "orderByRules"),
            sortThrottleWait: 0,
        });
        built.push(layer);
    }

    return {
        push: (objects) => listInstance.pushObjects(objects),
        stop: () => {
            for (const layer of built.reverse()) {
                layer.stop?.();
            }
        },
    };
};

describe(`useList layers inserting ${rowCount} rows`, () => {
    for (const layer of layers) {
        const label = layer === "instance" ? "instance only" : `up to ${layer}`;

        bench(
            `${label}`,
            async () => {
                const stack = composeUpTo(layer);
                try {
                    stack.push(rows);
                    await nextTick();
                } finally {
                    stack.stop();
                }
            },
            benchmarkOptions
        );
    }
});
