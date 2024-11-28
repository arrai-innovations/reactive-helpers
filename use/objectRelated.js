// noinspection ES6PreferShortImport
import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import { getObjectRelatedByKey } from "../utils/relatedCalculatedHelpers.js";
import { objectInstanceStateKeys } from "./objectInstance.js";
import { objectSubscriptionStateKeys } from "./objectSubscription.js";
import { useWatchesRunning } from "./watchesRunning.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, reactive, ref, toRef, unref, watch } from "vue";

/**
 * Vue Composition API composable function for handling reactive relations to other objects.
 *
 * @module use/objectRelated.js
 */

// todo: pkKey is misnamed, it should be fkKey... this will be a major breaking change.
/**
 * The rule for defining relationships for the managed object to other collections of objects.
 *
 * @typedef {object} ObjectRelatedRule
 * @property {string} pkKey - The key in the managed object that corresponds to the key in the related object.
 * @property {import('./listInstance.js').ObjectsByPk} objects - The related objects, indexed by the key in the related object.
 * @property {string[]} order - The order of the related objects, if the related objects are an array.
 */

/**
 * The rules for defining relationships for the managed object to other collections of objects.
 *
 * @typedef {{
 *     [rule: string]: ObjectRelatedRule,
 * }} ObjectRelatedRawRules
 */

/**
 *
 *
 * @typedef {object} ObjectRelatedRawState
 * @property {ObjectRelatedRawRules} relatedObjectRules - The rules for defining relationships for the managed object to other collections of objects.
 * @property {{
 *     [rule: string]: import('vue').ComputedRef<any>,
 * }} relatedObject - The related objects, indexed by the key in the related object.
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
 * )} ObjectRelatedParentRawState
 */

/**
 *
 *
 * @typedef {import('vue').UnwrapNestedRefs<ObjectRelatedParentRawState>} ObjectRelatedParentState
 */

/**
 *
 *
 * @typedef {import('vue').UnwrapNestedRefs<(
 *     ObjectRelatedParentRawState &
 *     ObjectRelatedRawState
 * )>} ObjectRelatedState
 */

export const objectRelatedStateKeys = [
    "relatedObject",
    "relatedObjectRules",
    "relatedObjectWatchRunning",
    "parentStateObjectWatchRunning",
    "relatedRunning",
    "running",
];

export const objectRelatedFunctions = [];

/**
 * @typedef {object} ObjectRelatedProperties
 * @property {ObjectRelatedState} state - The state of the object related instance.
 * @property {ObjectRelatedParentState} parentState - The parent state.
 * @property {import('./watchesRunning.js').WatchesRunning} watchesRunning - The watches running instance.
 * @property {import('vue').EffectScope} effectScope - The effect scope.
 *
 */

// if we provided functions, we would add a typedef and mix them into ObjectRelated

/**
 * An instance of an object related reactive object.
 *
 * @typedef {ObjectRelatedProperties} ObjectRelated
 */

/**
 * Non-parent state options for useObjectRelated.
 *
 * @typedef {object} ObjectRelatedRawProps
 * @property {import('vue').Ref<ObjectRelatedRawRules>} relatedObjectRules - The rules for defining relationships for the managed object to other collections of objects.
 */

/**
 * Options for useObjectRelated.
 *
 * @typedef {{
 *     parentState: ObjectRelatedParentState,
 * } & ObjectRelatedRawProps} ObjectRelatedOptions
 */

/**
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
 *     crudArgs: { app: 'foo', model: 'bar'},
 *     retrieveArgs: {},
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
 *             pkKey: 'some_objects_id',
 *             objects: someObjectsSource.objects,
 *         },
 *         some_objects_list_ids: {
 *             // pkKey defaults to match rule name
 *             objects: someObjectsSource.objects,
 *             order: ['3','1','2'],
 *         },
 *         secondOrder: {
 *             pkKey: 'relatedObject.secondOrderId',
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
export function useObjectRelated({ parentState, relatedObjectRules }) {
    /** @type {ObjectRelatedState} */
    // @ts-ignore - other keys are added in effectScope or as refs from elsewhere
    const state = reactive({
        relatedObjectRules,
        relatedObject: {},
        parentStateObjectWatchRunning: false,
        relatedObjectWatchRunning: false,
    });

    let watchesRunning = null;

    const es = effectScope();

    const internalState = reactive({
        /** @type {{[rule: string]: import('vue').ComputedRef<[obj:any, key:string]>}} */
        objAndKeyForRule: {},
        /** @type {{[rule: string]: import('vue').ComputedRef<string|string[]|undefined>}} */
        fkForRule: {},
    });

    function applyRule(ruleKey) {
        const rule = toRef(state.relatedObjectRules, ruleKey);
        const originalObjectRef = toRef(parentState, "object");
        const relatedObjectRef = toRef(state, "relatedObject");
        internalState.objAndKeyForRule[ruleKey] = computed(() => {
            const rulePkKey = unref(rule).pkKey || ruleKey;
            return getObjectRelatedByKey(unref(originalObjectRef), unref(relatedObjectRef), rulePkKey);
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
                value.sort((a, b) => {
                    const aIndex = indexById[a];
                    const bIndex = indexById[b];
                    return aIndex - bIndex;
                });
            }
            return value;
        });
        state.relatedObject[ruleKey] = computed(() => {
            const value = unref(internalState.fkForRule[ruleKey]);
            const objects = unref(rule).objects;
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
            // @ts-ignore - this is an unofficial api, effect is internal
            state.relatedObject[removedRuleKey]?.effect?.stop?.();
            delete state.relatedObject[removedRuleKey];
            // @ts-ignore - this is an unofficial api, effect is internal
            internalState.fkForRule[removedRuleKey]?.effect?.stop?.();
            delete internalState.fkForRule[removedRuleKey];
            // @ts-ignore - this is an unofficial api, effect is internal
            internalState.objAndKeyForRule[removedRuleKey]?.effect?.stop?.();
            delete internalState.objAndKeyForRule[removedRuleKey];
        }

        for (const addedRuleKey of addedRuleKeys) {
            applyRule(addedRuleKey);
        }
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

        watch([() => state.relatedObjectRules && Object.keys(state.relatedObjectRules)], watchRules, {
            immediate: true,
        });

        watchesRunning = useWatchesRunning({
            triggerRefs: [computed(() => (!isEmpty(state.relatedObjectRules) ? parentState.loading : false))],
            watchSentinelRefs: [
                toRef(state, "parentStateObjectWatchRunning"),
                toRef(state, "relatedObjectWatchRunning"),
            ],
        });

        // @ts-ignore - assignment to UnwrapNestedRefs triggers tsc to mismatch on Ref vs non-Ref
        state.relatedRunning = toRef(watchesRunning.state, "running");
        const parentRunning = ref(undefined);
        proxyRunning(parentState, "running", parentRunning);
        // @ts-ignore - assignment to UnwrapNestedRefs triggers tsc to mismatch on Ref vs non-Ref
        state.running = computed(() => loadingCombine(watchesRunning.state.running, parentRunning));
    });

    return {
        state,
        parentState,
        watchesRunning,
        effectScope: es,
    };
}
