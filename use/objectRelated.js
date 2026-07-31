// noinspection ES6PreferShortImport
import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import {
    getObjectRelatedByKey,
    ruleForeignKey,
    warnDeprecatedRulePkKey,
    warnWrongChainingPrefix,
    warnWrongSideRuleOptions,
} from "../utils/relatedCalculatedHelpers.js";
import { objectInstanceStateKeys } from "./objectInstance.js";
import { objectSubscriptionStateKeys } from "./objectSubscription.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, nextTick, reactive, ref, toRef, unref, watch } from "vue";

/**
 * Vue Composition API composable function for handling reactive relations to other objects.
 *
 * @module use/objectRelated.js
 */

/**
 * Defines a custom error class specific to object related rules, encapsulating details about rules that cannot be
 *  resolved as configured.
 */
export class ObjectRelatedError extends Error {
    /**
     * Creates an instance of ObjectRelatedError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message, code) {
        super(message);
        this.name = "ObjectRelatedError";
        this.code = code;
    }
}

/**
 * @typedef {object} ObjectRelatedRule - The rule for defining relationships for the managed object to other collections of objects.
 * @property {string} [fkKey] - The foreign key on the managed object that corresponds to the key in the related
 *  object. Defaults to the rule's own key when omitted.
 * @property {string} [pkKey] - Deprecated alias for `fkKey`, removed in v24. The option never named a primary key.
 *  A rule setting both uses `fkKey`.
 * @property {import('./listInstance.js').ObjectsByPk} objects - The related objects, indexed by the key in the related object.
 * @property {string[]} [order] - The order of the related objects, if the related objects are an array.
 */

/**
 * @typedef {{
 *     [rule: string]: ObjectRelatedRule,
 * }} ObjectRelatedRawRules - The rules for defining relationships for the managed object to other collections of objects.
 */

/**
 *
 *
 * @typedef {object} ObjectRelatedRawState - The raw reactive state of the object related composable, holding its rules, computed relations, and running flags.
 * @property {ObjectRelatedRawRules} relatedObjectRules - The rules for defining relationships for the managed object to other collections of objects.
 * @property {{
 *     [rule: string]: any,
 * }} relatedObject - The related objects, by rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the related object (or array of related objects) and never carry a `.value`.
 * @property {boolean} relatedObjectWatchRunning - Whether the related object watch is running.
 * @property {boolean} parentStateObjectWatchRunning - Whether the parent state object watch is running.
 * @property {boolean} relatedRunning - Whether the related objects are loading.
 * @property {boolean} running - Whether the related objects are loading or the parent state is loading.
 */

/**
 *
 *
 * @typedef {(
 *    import('./objectInstance.js').ObjectInstanceRawState &
 *    Partial<import('./objectSubscription.js').ObjectSubscriptionRawState>
 * )} ObjectRelatedParentRawState - The raw, pre-unwrapped parent state consumed by the object related mixin (object instance plus optional subscription state).
 */

/**
 *
 *
 * @typedef {import('vue').UnwrapNestedRefs<ObjectRelatedParentRawState>} ObjectRelatedParentState - The unwrapped reactive parent state consumed by the object related mixin.
 */

/**
 *
 *
 * @typedef {import('vue').UnwrapNestedRefs<(
 *     ObjectRelatedParentRawState &
 *     ObjectRelatedRawState
 * )>} ObjectRelatedState - The unwrapped reactive state of the object related composable, combining the parent state with its own related state.
 */

/** @internal */
export const objectRelatedStateKeys = [
    "relatedObject",
    "relatedObjectRules",
    "relatedObjectWatchRunning",
    "parentStateObjectWatchRunning",
    "relatedRunning",
    // "running" is deliberately absent: a downstream layer combines the parent's running into its own computed,
    //  so copying it here would overwrite that computed with the parent's value.
];

/** @internal */
export const objectRelatedFunctions = [];

/**
 * @typedef {object} ObjectRelatedProperties - The members (state, parentState, stop) contributed by the object related composable.
 * @property {ObjectRelatedState} state - The state of the object related instance.
 * @property {ObjectRelatedParentState} parentState - The parent state.
 * @property {() => void} stop - Stops all effects of the object related instance.
 *
 */

// if we provided functions, we would add a typedef and mix them into ObjectRelated

/**
 * @typedef {ObjectRelatedProperties} ObjectRelated - An instance of an object related reactive object.
 */

/**
 * @typedef {object} ObjectRelatedRawProps - Non-parent state options for useObjectRelated.
 * @property {import('vue').Ref<ObjectRelatedRawRules>} relatedObjectRules - The rules for defining relationships for the managed object to other collections of objects.
 */

/**
 * @typedef {{
 *     parentState: ObjectRelatedParentState,
 * } & ObjectRelatedRawProps} ObjectRelatedOptions - Options for useObjectRelated.
 */

/**
 * Creates multiple object related instances keyed by name from a map of options.
 *
 * @param {{
 *     [key: string]: ObjectRelatedOptions
 * }} objectRelatedArgs - The options for the desired object related reactive objects.
 * @returns {{
 *     [key: string]: ObjectRelated
 * }} - The object related instances, indexed by key.
 */
export function useObjectRelateds(objectRelatedArgs) {
    /** @type {{[key: string]: ObjectRelated}} */
    const relateds = {};
    for (const [key, value] of Object.entries(objectRelatedArgs)) {
        relateds[key] = useObjectRelated(value);
    }
    return relateds;
}

/**
 * Creates an object related reactive object.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useObjectRelated, useObjectSubscription } from "@arrai-innovations/reactive-helpers";
 * import { ref, reactive } from "vue";
 *
 * const someObjectsSource = reactive({
 *     objects: {
 *         '1': { id: 1, name: 'one', secondOrderId: 15 },
 *         '2': { id: 2, name: 'two', secondOrderId: 10 },
 *         '3': { id: 3, name: 'three', secondOrderId: 5 },
 *     },
 * });
 * const someOtherObjectsSource = reactive({
 *     objects: {
 *         '5': { id: 5, name: 'five' },
 *         '10': { id: 10, name: 'ten' },
 *         '15': { id: 15, name: 'fifteen' },
 *     },
 * });
 * const objectSubscriptionProps = reactive({
 *     target: { app: 'foo', model: 'bar'},
 *     params: {},
 *     pk: '99',
 *     pkKey: 'id',
 *     intendToSubscribe: true,
 *     intendToRetreive: true,
 * });
 * const objectSubscription = useObjectSubscription(objectSubscriptionProps);
 * // objectSubscription.state.object like:
 * // {
 * //     id: '99',
 * //     some_objects_id: '2',
 * //     some_objects_list_ids: ['1','2','3'],
 * // }
 * const objectRelatedProps = reactive({
 *     parentState: objectSubscription.state,
 *     relatedObjectRules: {
 *         firstOrder: {
 *             fkKey: 'some_objects_id',
 *             objects: someObjectsSource.objects,
 *         },
 *         some_objects_list_ids: {
 *             // fkKey defaults to match rule name
 *             objects: someObjectsSource.objects,
 *             order: ['3','1','2'],
 *         },
 *         secondOrder: {
 *             fkKey: 'relatedItem.firstOrder.secondOrderId',
 *             objects: someOtherObjectsSource.objects,
 *         },
 *     },
 * });
 * const objectRelated = useObjectRelated(objectRelatedProps);
 * </script>
 * <template>
 * <div>
 *     <p>{{ objectRelated.state.relatedObject.firstOrder }}</p>
 *     <!-- { id: 2, name: 'two', secondOrderId: 10 } -->
 *
 *     <p>{{ objectRelated.state.relatedObject.some_objects_list_ids }}</p>
 *     <!-- [{ id: 3, name: 'three', secondOrderId: 5 }, { id: 1, name: 'one', secondOrderId: 15 }, { id: 2, name: 'two', secondOrderId: 10 }] -->
 *
 *     <p>{{ objectRelated.state.relatedObject.secondOrder }}</p>
 *     <!-- { id: 10, name: 'ten' } -->
 * </div>
 * </template>
 * ```
 *
 * @param {ObjectRelatedOptions} options - The options for the object related reactive object.
 * @returns {ObjectRelated} - The object related reactive object.
 */
export function useObjectRelated(options) {
    warnWrongSideRuleOptions("useObjectRelated", options, "object");
    const { parentState, relatedObjectRules } = options;
    const es = effectScope();
    /** @type {Set<string>} */
    const warnedChainingPrefixes = new Set();
    /** @type {Set<string>} */
    const warnedDeprecatedPkKeys = new Set();
    /** @type {import('vue').Ref<boolean|undefined>} */
    const parentRunning = ref(undefined);
    proxyRunning(parentState, "running", parentRunning);
    /** @type {ObjectRelatedState} */
    // @ts-ignore - other keys are added in effectScope or as refs from elsewhere
    const state = reactive({
        relatedObjectRules,
        relatedObject: {},
        parentStateObjectWatchRunning: true,
        relatedObjectWatchRunning: true,
        relatedRunning: computed(() =>
            loadingCombine(state.parentStateObjectWatchRunning, state.relatedObjectWatchRunning)
        ),
        running: computed(() => loadingCombine(state.relatedRunning, parentRunning.value)),
    });

    const internalState = reactive({
        /** @type {{[rule: string]: import('vue').ComputedRef<[obj:any, key:string]>}} */
        objAndKeyForRule: {},
        /** @type {{[rule: string]: import('vue').ComputedRef<string|string[]|undefined>}} */
        fkForRule: {},
    });

    function applyRule(ruleKey) {
        const rule = toRef(state.relatedObjectRules, ruleKey);
        warnDeprecatedRulePkKey("useObjectRelated", ruleKey, unref(rule), warnedDeprecatedPkKeys);
        warnWrongChainingPrefix("useObjectRelated", ruleKey, ruleForeignKey(unref(rule)), warnedChainingPrefixes);
        const originalObjectRef = toRef(parentState, "object");
        const relatedObjectRef = toRef(state, "relatedObject");
        internalState.objAndKeyForRule[ruleKey] = computed(() => {
            const ruleFkKey = ruleForeignKey(unref(rule)) || ruleKey;
            return getObjectRelatedByKey(unref(originalObjectRef), unref(relatedObjectRef), ruleFkKey);
        });
        internalState.fkForRule[ruleKey] = computed(() => {
            const ruleOrder = unref(rule).order;
            const relatedObject = unref(relatedObjectRef);
            const [objectForGet, key] = unref(internalState.objAndKeyForRule[ruleKey]);
            let value = get(objectForGet, key);
            if (objectForGet === relatedObject && isUndefined(value)) {
                // Handle nested arrays
                const firstLevelKey = key.split(".")[0];
                const firstLevelItem = get(relatedObject, firstLevelKey);
                if (isArray(firstLevelItem)) {
                    const restOfKey = key.split(".").slice(1).join(".");
                    value = firstLevelItem.map((e) => get(e, restOfKey)).flat();
                }
            }
            if (isArray(value) && ruleOrder?.length) {
                value = value.filter(identity);
                const indexById = Object.fromEntries(ruleOrder.map((e, i) => [e, i]));
                // An id the order does not list sorts to a shared index past the end, so those ids
                //  land last and keep their foreign-key order between themselves through a stable
                //  sort. Comparing an absent id directly would yield NaN and leave it unpositioned.
                const missingIndex = ruleOrder.length;
                value.sort((a, b) => (indexById[a] ?? missingIndex) - (indexById[b] ?? missingIndex));
            }
            return value;
        });
        state.relatedObject[ruleKey] = computed(() => {
            const value = unref(internalState.fkForRule[ruleKey]);
            const objects = unref(rule).objects;
            if (!objects) {
                // read time rather than creation time: when two managers relate to each other, one exists first,
                //  so a rule legitimately sits unresolvable while the other is being wired.
                throw new ObjectRelatedError(
                    `useObjectRelated: rule "${ruleKey}" has no objects to resolve against.`,
                    "missing-objects"
                );
            }
            if (isArray(value)) {
                return value.map((e) => objects[e]).filter(identity);
            }
            return objects[value];
        });
    }

    function watchRules() {
        // sameKeys are handled by the computeds,
        //  we just need to setup or stop the computeds for the new or removed keys.
        /** @type {Set<string>|undefined} */
        let addedRuleKeys, removedRuleKeys;
        if (state.relatedObjectRules && !isEmpty(state.relatedObjectRules)) {
            ({ addedKeys: addedRuleKeys, removedKeys: removedRuleKeys } = keyDiff(
                Object.keys(state.relatedObjectRules),
                Object.keys(state.relatedObject)
            ));
        } else {
            removedRuleKeys = new Set(Object.keys(state.relatedObject));
            addedRuleKeys = new Set();
        }
        for (const removedRuleKey of removedRuleKeys) {
            // Delete without reading: state.relatedObject unwraps refs, so reading a removed rule's entry would
            //  re-evaluate its computed chain against a rule that is already gone. Dropping the last reference to
            //  each computed is enough to release it.
            delete state.relatedObject[removedRuleKey];
            delete internalState.fkForRule[removedRuleKey];
            delete internalState.objAndKeyForRule[removedRuleKey];
        }

        for (const addedRuleKey of addedRuleKeys) {
            applyRule(addedRuleKey);
        }
        nextTick(() => {
            state.relatedObjectWatchRunning = false;
        });
    }

    es.run(() => {
        for (const key of objectInstanceStateKeys) {
            // @ts-ignore - assignment of remaining expected keys
            state[key] = toRef(parentState, key);
        }
        for (const key of objectSubscriptionStateKeys) {
            // @ts-ignore - assignment of remaining expected keys
            state[key] = toRef(parentState, key);
        }

        watch(
            () => parentState.object,
            () => {
                state.parentStateObjectWatchRunning = true;
            },
            { flush: "sync" }
        );
        watch(
            () => parentState.object,
            () => {
                nextTick(() => {
                    state.parentStateObjectWatchRunning = false;
                });
            },
            { immediate: true }
        );
        watch(
            [() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)],
            () => {
                state.relatedObjectWatchRunning = true;
            },
            { flush: "sync" }
        );
        watch(
            [() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)],
            () => {
                watchRules();
            },
            { immediate: true }
        );
    });

    return {
        state,
        parentState,
        stop: () => {
            es.stop();
        },
    };
}
