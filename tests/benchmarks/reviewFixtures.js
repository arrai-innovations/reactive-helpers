import { effectScope, reactive, toRef, watchEffect } from "vue";
import { useList } from "../../use/list.js";
import { useListCalculated } from "../../use/listCalculated.js";
import { useListFilter } from "../../use/listFilter.js";
import { useListInstance } from "../../use/listInstance.js";
import { useListRelated } from "../../use/listRelated.js";
import { useListSearch } from "../../use/listSearch.js";
import { useListSort } from "../../use/listSort.js";

// A review-shaped list. The fixtures in `fixtures.js` give every layer one representative rule, which
// measures the cost of a layer being present. This file measures the cost of a layer being busy: a
// related graph deep enough that one rule's value feeds another's foreign key, a sort that orders on
// a related value rather than a record field, and calculated rules that read related values. Those
// three edges are what turn a structural write in a derived layer into a wide invalidation, and the
// existing fixtures form none of them.

/** How many entries each generated lookup collection holds. */
export const lookupSize = 13;

/**
 * Build one lookup collection for a related rule to resolve against.
 *
 * Each entry carries `link`, a foreign key into the next collection in the chain, so a rule can take
 * its own foreign key from another rule's resolved value. `rank` gives a sort a related value to
 * order on that is not present on the record.
 *
 * @param {number} index - Which collection this is, so its values differ from its neighbours'.
 * @returns {import('../../use/listInstance.js').ObjectsByPk} - The lookup collection, keyed by pk.
 */
export const makeLookup = (index) =>
    Object.fromEntries(
        Array.from({ length: lookupSize }, (_, entry) => [
            String(entry),
            {
                id: entry,
                name: `Lookup ${index} entry ${entry}`,
                link: String((entry * 7 + index) % lookupSize),
                rank: (entry * 3 + index) % lookupSize,
            },
        ])
    );

/** Lookup collection for the array-valued rule, which resolves a list of foreign keys per record. */
export const tagLookup = makeLookup(99);

/** The order the array-valued rule sorts its resolved tags into. */
export const tagOrder = Array.from({ length: lookupSize }, (_, entry) => String((entry * 5) % lookupSize));

/**
 * Build a related rule set of a given width.
 *
 * Even-numbered rules resolve a foreign key held on the record. Odd-numbered rules chain: their
 * foreign key is `relatedItem.` followed by the previous rule's value, so resolving one depends on
 * the other having resolved first. A production review list mixes both, and only the chained form
 * makes the related layer's output feed back into its own input.
 *
 * @param {number} ruleCount - How many related rules to build.
 * @param {boolean} [includeArrayRule] - Whether to add an array-valued rule carrying an `order`.
 * @returns {import('../../use/listRelated.js').ListRelatedRules} - The rules, keyed `r0` upward.
 */
export const makeRelatedRules = (ruleCount, includeArrayRule = false) => {
    /** @type {import('../../use/listRelated.js').ListRelatedRules} */
    const rules = {};
    for (let index = 0; index < ruleCount; index++) {
        if (index % 2 === 0) {
            rules[`r${index}`] = { fkKey: `fk${index}`, objects: makeLookup(index) };
        } else {
            rules[`r${index}`] = { fkKey: `relatedItem.r${index - 1}.link`, objects: makeLookup(index) };
        }
    }
    if (includeArrayRule) {
        rules.tags = { fkKey: "tagIds", order: tagOrder, objects: tagLookup };
    }
    return rules;
};

/**
 * Build a calculated rule set of a given width.
 *
 * A calculated rule receives the record, its related bag, and the calculated bag being built. Rules
 * that read the related bag subscribe the calculated layer to the related layer, which is the edge a
 * rule reading only the record never forms.
 *
 * @param {number} ruleCount - How many calculated rules to build.
 * @param {number} relatedRuleCount - How many related rules exist, so a rule can read one.
 * @returns {{[rule: string]: (object: object, related: object, calculated: object) => any}} - The rules, keyed `c0` upward.
 */
export const makeCalculatedRules = (ruleCount, relatedRuleCount) => {
    /** @type {{[rule: string]: (object: object, related: object, calculated: object) => any}} */
    const rules = {};
    for (let index = 0; index < ruleCount; index++) {
        if (relatedRuleCount) {
            const ruleKey = `r${index % relatedRuleCount}`;
            rules[`c${index}`] = (object, related) => `${object.name}:${related?.[ruleKey]?.rank ?? ""}`;
        } else {
            rules[`c${index}`] = (object) => `${object.name}:${object.id * 2}`;
        }
    }
    return rules;
};

/**
 * Build records carrying the foreign keys the generated rules read.
 *
 * @param {number} count - How many records to build.
 * @param {number} [start] - The first pk to use.
 * @param {number} [fkCount] - How many foreign-key fields each record carries.
 * @returns {object[]} - The generated records.
 */
export const makeReviewRows = (count, start = 1, fkCount = 24) =>
    Array.from({ length: count }, (_, index) => {
        const id = start + index;
        /** @type {{[key: string]: any}} */
        const row = {
            id,
            name: `Row ${id}`,
            tagIds: [String(id % lookupSize), String((id * 3) % lookupSize), String((id * 7) % lookupSize)],
        };
        for (let fk = 0; fk < fkCount; fk++) {
            row[`fk${fk}`] = String((id * (fk + 1)) % lookupSize);
        }
        return row;
    });

/**
 * The order-by rules for each sort shape a review list can take.
 *
 * `related` and `calculated` order on a derived value, so the sort layer's per-record criteria
 * subscribe to a layer upstream of it rather than to the record.
 *
 * @param {"none"|"plain"|"related"|"calculated"} sortOn - Which value the sort orders on.
 * @returns {import('../../use/listSort.js').OrderByRule[]} - The order-by rules.
 */
export const makeOrderByRules = (sortOn) => {
    switch (sortOn) {
        case "plain":
            return [{ key: "fk0", desc: true, localeCompare: false }];
        case "related":
            return [{ key: "relatedItem.r0.rank", desc: true, localeCompare: false }];
        case "calculated":
            return [{ key: "calculatedItem.c0", desc: false, localeCompare: true }];
        default:
            return [];
    }
};

/**
 * @typedef {object} ReviewListOptions - The shape of the review list to build.
 * @property {number} [relatedRuleCount] - How many related rules the list carries.
 * @property {number} [calculatedRuleCount] - How many calculated rules the list carries.
 * @property {"none"|"plain"|"related"|"calculated"} [sortOn] - Which value the sort orders on.
 * @property {boolean} [includeArrayRule] - Whether the related rules include an array-valued rule.
 * @property {boolean} [filter] - Whether an allowed filter is active.
 * @property {number} [sortThrottleWait] - The sort throttle, in milliseconds.
 */

/**
 * Build a composed list of a given review shape.
 *
 * @param {ReviewListOptions} [options] - The shape to build.
 * @returns {ReturnType<typeof useList>} - The composed list manager.
 */
export const makeReviewList = ({
    relatedRuleCount = 12,
    calculatedRuleCount = 4,
    sortOn = "related",
    includeArrayRule = false,
    filter = true,
    sortThrottleWait = 0,
} = {}) =>
    useList({
        props: reactive({
            allowedFilter: filter ? (object) => object.id >= 0 : undefined,
            calculatedObjectsRules: makeCalculatedRules(calculatedRuleCount, relatedRuleCount),
            customDocumentOptions: {},
            customSearchOptions: {},
            excludedFilter: undefined,
            intendToList: false,
            intendToSubscribe: false,
            orderByRules: makeOrderByRules(sortOn),
            params: {},
            pkKey: "id",
            relatedObjectsRules: makeRelatedRules(relatedRuleCount, includeArrayRule),
            target: {},
            textSearchRules: [],
            textSearchValue: "",
        }),
        sortThrottleWait,
    });

/**
 * Compose the list stack layer by layer, keeping every layer's state reachable.
 *
 * `useList` returns only the last layer's state, so a cost measured against it cannot be attributed to
 * the layer that produced it. Building the same stack here exposes each layer's `objects` view, which
 * lets an observer attach at every depth and show where a notification enters the chain.
 *
 * @param {ReviewListOptions} [options] - The shape to build, matching `makeReviewList`.
 * @returns {{states: {[layer: string]: object}, push: (objects: object[]) => void, stop: () => void}} - Each layer's state, the entry point for records, and teardown.
 */
export const composeReviewStack = ({
    relatedRuleCount = 12,
    calculatedRuleCount = 4,
    sortOn = "related",
    includeArrayRule = false,
    filter = true,
    sortThrottleWait = 0,
} = {}) => {
    const props = reactive({
        allowedFilter: filter ? (object) => object.id >= 0 : undefined,
        calculatedObjectsRules: makeCalculatedRules(calculatedRuleCount, relatedRuleCount),
        customDocumentOptions: {},
        customSearchOptions: {},
        excludedFilter: undefined,
        intendToList: false,
        intendToSubscribe: false,
        orderByRules: makeOrderByRules(sortOn),
        params: {},
        pkKey: "id",
        relatedObjectsRules: makeRelatedRules(relatedRuleCount, includeArrayRule),
        target: {},
        textSearchRules: [],
        textSearchValue: "",
    });

    const built = [];
    const states = {};

    const listInstance = useListInstance({ props, handlers: {} });
    built.push(listInstance);
    states.instance = listInstance.state;

    const listRelated = useListRelated({
        parentState: states.instance,
        relatedObjectsRules: toRef(props, "relatedObjectsRules"),
    });
    built.push(listRelated);
    states.related = listRelated.state;

    const listCalculated = useListCalculated({
        parentState: states.related,
        calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
    });
    built.push(listCalculated);
    states.calculated = listCalculated.state;

    const listFilter = useListFilter({
        parentState: states.calculated,
        allowedFilter: toRef(props, "allowedFilter"),
        excludedFilter: toRef(props, "excludedFilter"),
    });
    built.push(listFilter);
    states.filter = listFilter.state;

    const listSearch = useListSearch({ parentState: states.filter, props });
    built.push(listSearch);
    states.search = listSearch.state;

    const listSort = useListSort({
        parentState: states.search,
        orderByRules: toRef(props, "orderByRules"),
        sortThrottleWait,
    });
    built.push(listSort);
    states.sort = listSort.state;

    return {
        states,
        push: (objects) => listInstance.pushObjects(objects),
        stop: () => {
            for (const layer of built.reverse()) {
                layer.stop?.();
            }
        },
    };
};

/**
 * The reads a rendered application makes against a list, one named channel per dependency.
 *
 * Each channel becomes its own effect, so a notification is attributed to the value that raised it by
 * construction. Vue's `onTrigger` cannot do this attribution here: a notification arriving through a
 * chain of computed values carries the receiving effect and nothing else, so an effect reading several
 * values learns only that it was notified.
 *
 * A collection channel reads across the whole list, as the `v-for` itself does. A record channel reads
 * one record's values, as the component rendering that row does.
 */
export const readChannels = {
    /** @type {{[channel: string]: (state: object) => void}} */
    collection: {
        order: (state) => {
            void state.order.length;
        },
        objectsInOrder: (state) => {
            for (const object of state.objectsInOrder) {
                void object;
            }
        },
    },
    /** @type {{[channel: string]: (state: object, pk: string) => void}} */
    record: {
        field: (state, pk) => {
            void state.objects[pk]?.name;
        },
        related: (state, pk) => {
            void state.relatedObjects?.[pk]?.r0?.name;
        },
        relatedChained: (state, pk) => {
            void state.relatedObjects?.[pk]?.r1?.name;
        },
        calculated: (state, pk) => {
            void state.calculatedObjects?.[pk]?.c0;
        },
    },
};

/**
 * @typedef {object} RenderObserverOptions - Which channels observe the list.
 * @property {string[]} [collectionChannels] - Names from `readChannels.collection` to attach once.
 * @property {string[]} [recordChannels] - Names from `readChannels.record` to attach per record.
 */

/**
 * @typedef {object} ChannelCounts - What one channel's effects have done.
 * @property {number} effects - How many effects the channel has attached.
 * @property {number} runs - How many times those effects have evaluated.
 * @property {number} triggers - How many times those effects have been notified.
 */

/**
 * Attach effects that read the list the way a rendered component tree does.
 *
 * Without an active subscriber a derived value is never pulled, so a computed that has been marked
 * dirty costs nothing to leave dirty and a notification has nowhere to be delivered. A benchmark that
 * pushes records and never reads them back therefore measures a graph nobody is watching, which is not
 * the graph a mounted application presents. These effects supply the missing side.
 *
 * The gap between a channel's `triggers` and its `runs` is the quantity of interest. A run is work the
 * application asked for. A trigger that does not lead to a run is a notification delivered to an effect
 * whose value did not change, which is the cost that scales with how widely a write fans out.
 *
 * `sync()` attaches record effects for records that have arrived since the last call, which is what a
 * `v-for` does when a page lands.
 *
 * @param {object} state - The composed list state to observe.
 * @param {RenderObserverOptions} [options] - Which channels to attach.
 * @returns {{
 *     sync: () => void,
 *     stop: () => void,
 *     counts: {[channel: string]: ChannelCounts},
 *     totals: () => {effects: number, runs: number, triggers: number},
 *     reset: () => void,
 * }} - Control over the attached effects, and what they have done.
 */
export const attachRenderObservers = (state, { collectionChannels = [], recordChannels = [] } = {}) => {
    const scope = effectScope();
    const observed = new Set();
    /** @type {{[channel: string]: ChannelCounts}} */
    const counts = {};

    for (const channel of [...collectionChannels, ...recordChannels]) {
        counts[channel] = { effects: 0, runs: 0, triggers: 0 };
    }

    /**
     * Attach one effect for one channel.
     *
     * @param {string} channel - The channel's name, which its counts are keyed by.
     * @param {() => void} read - The read the effect performs.
     * @returns {void}
     */
    const attach = (channel, read) => {
        scope.run(() => {
            watchEffect(
                () => {
                    counts[channel].runs++;
                    read();
                },
                { onTrigger: () => counts[channel].triggers++ }
            );
        });
        counts[channel].effects++;
    };

    for (const channel of collectionChannels) {
        attach(channel, () => readChannels.collection[channel](state));
    }

    return {
        sync: () => {
            if (!recordChannels.length) {
                return;
            }
            for (const pk of Object.keys(state.objects)) {
                if (observed.has(pk)) {
                    continue;
                }
                observed.add(pk);
                for (const channel of recordChannels) {
                    attach(channel, () => readChannels.record[channel](state, pk));
                }
            }
        },
        stop: () => scope.stop(),
        counts,
        totals: () =>
            Object.values(counts).reduce(
                (total, channel) => ({
                    effects: total.effects + channel.effects,
                    runs: total.runs + channel.runs,
                    triggers: total.triggers + channel.triggers,
                }),
                { effects: 0, runs: 0, triggers: 0 }
            ),
        reset: () => {
            for (const channel of Object.values(counts)) {
                channel.runs = 0;
                channel.triggers = 0;
            }
        },
    };
};
