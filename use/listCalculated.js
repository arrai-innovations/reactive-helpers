import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import isEmpty from "lodash-es/isEmpty.js";
import { computed, effectScope, nextTick, reactive, ref, toRef, toRefs, unref, watch } from "vue";

/**
 * This module provides a Vue Composition API composable function for dynamically calculating properties in lists
 * based on complex business logic. It integrates with list management systems to apply user-defined rules
 * that calculate new properties based on changes in list items or related data. This is particularly useful for
 * applications that need to display derived data without altering the original source objects in the list.
 *
 * @module use/listCalculated.js
 */

/**
 * @typedef {{
 *     [rule: string]: (
 *         object: import('../use/objectInstance.js').ExistingCrudObject,
 *         relatedObject: {
 *             [rule: string]: any,
 *         },
 *         calculatedObjects: {
 *             [rule: string]: import('vue').ComputedRef<any>,
 *         }
 *     ) => any,
 * }}  ListCalculatedRules - Defines rules for dynamically calculating new properties for objects in a list. Each rule is a function that takes an object from the list, optionally its related objects, and previously calculated properties to compute a new property. These functions are reactive and re-evaluate when underlying dependencies change.
 */

/**
 * The raw state for a list calculated.
 *
 * @typedef {object} ListCalculatedRawState - The raw state for a list calculated property.
 * @property {{[pk: import('../config/commonCrud.js').Pk]: {[rule: string]: import('vue').ComputedRef<any>}}} calculatedObjects - The calculated objects.
 * @property {ListCalculatedRules} calculatedObjectsRules - The rules for the calculated objects.
 * @property {boolean} calculatedObjectsParentStateObjectsWatchRunning - Whether the parent state objects watch is running.
 * @property {boolean} calculatedObjectsWatchRunning - Whether the calculated objects watch is running.
 * @property {import('vue').ComputedRef<boolean>} calculatedRunning - Whether the calculated properties are running.
 * @property {import('vue').ComputedRef<boolean>} running - Whether the list is running.
 * @private
 */

/**
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState>
 * )} ListCalculatedParentRawState - The raw parent state for a list calculated.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListCalculatedParentRawState &
 *     ListCalculatedRawState
 * >} ListCalculatedState - The state for a list calculated property.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState> &
 *     Partial<import('./listRelated.js').ListRelatedRawState>
 * )>} ListCalculatedParentState - Represents a combined reactive state that includes properties from list related, subscription, and instance modules.
 */

/**
 * The options to create a list calculated composition function.
 *
 * @typedef {object} ListCalculatedOptions - Options to configure the behavior of the list calculated properties.
 * @property {ListCalculatedParentState} parentState - The parent state that interacts with the calculated objects.
 * @property {import('vue').Ref<ListCalculatedRules>} calculatedObjectsRules - A reactive reference to rules used for dynamic calculations
 *  within list objects. Proper setup of this reference ensures that updates are managed reactively, including deep
 *  property changes.
 */

/**
 * @typedef {object} ListCalculatedProperties - The properties for the list computed composition function.
 * @property {ListCalculatedState} state - The state for the list calculated property.
 * @property {ListCalculatedParentState} parentState - The parent state object.
 * @property {() => void} stop - Stops composition's effects and cleans up resources.
 */

// if we provided functions, we would add a typedef and mix them into ListCalculated

/**
 * @typedef {ListCalculatedProperties} ListCalculated - The instance of `useListCalculated`.
 */

/**
 * A composable function to create multiple list calculated objects.
 *
 * @param {{
 *     [key: string]: ListCalculatedOptions
 * }} listCalculatedArgs - The arguments for the list calculated objects.
 * @returns {{[key: string]: ListCalculated}} - The list calculated objects.
 */
export function useListCalculateds(listCalculatedArgs) {
    /** @type {{[key: string]: ListCalculated}} */
    const calculateds = {};
    for (const [key, value] of Object.entries(listCalculatedArgs)) {
        calculateds[key] = useListCalculated(value);
    }
    return calculateds;
}

/**
 * Initializes and manages a calculated properties object for lists. This function sets up reactive states and computations
 * that dynamically update as specified in `calculatedObjectsRules`. It is used to add derived properties to list items,
 * which depend on complex calculations or interactions between multiple objects in the list. These derived properties
 * are reactive and will update in real-time as the underlying data changes, which is essential for maintaining data
 * consistency in dynamic UIs.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useListSubscription, useListCalculated } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const listSubscriptionProps = reactive({
 *     // whatever props you need to get the list to work with your crud implementation
 *     target: {},
 *     params: {},
 *     pkKey: "pk",
 *     intendToList: true,
 * });
 * const listSubscription = useListSubscription(listSubscriptionProps);
 * const listCalculatedProps = reactive({
 *     parentState: listSubscription.state,
 *     computedObjectsRules: {
 *         someRule: (object, relatedObjects, calculatedObjects) => {
 *            // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
 *            // calculatedObjects would be the other calculated objects in the list
 *            // including yourself, so try not to create circular dependencies
 *            // this is used as a computed body.
 *            return object.someProperty + object.someOtherProperty;
 *         }
 *     },
 * });
 * const listCalculated = useListCalculated(listCalculatedProps);
 * </script>
 * <template>
 *     <ul>
 *         <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
 *         <li v-for="obj in listInstance.state.objectsInOrder">
 *             {{ obj }}
 *             <div>
 *                 <!-- the computed object or objects based on the rule -->
 *                 {{ listCalculated.state.computedObjects[obj.pk].someRule }}
 *             </div>
 *         </li>
 *     </ul>
 * </template>
 * ```
 *
 * @param {ListCalculatedOptions} options - Configuration options including the parent state and rules for dynamically
 *  generating calculated properties. This setup allows the system to handle calculations as part of the list management
 *  process, ensuring that all related data is consistently updated.
 * @returns {ListCalculated} - A reactive instance that manages and provides access to calculated properties within the
 *  list, facilitating real-time updates and complex dependency management across multiple components.
 */
export function useListCalculated({ parentState, calculatedObjectsRules }) {
    const es = effectScope();
    const parentRefs = toRefs(parentState);
    /** @type {import('vue').Ref<boolean|undefined>} */
    const parentRunning = ref(undefined);
    proxyRunning(parentState, "running", parentRunning);
    /** @type {ListCalculatedState} */
    const state = reactive({
        ...parentRefs,
        calculatedObjectsRules,
        calculatedObjects: {},
        calculatedObjectsParentStateObjectsWatchRunning: true,
        calculatedObjectsWatchRunning: true,
        calculatedRunning: computed(() =>
            loadingCombine(state.calculatedObjectsParentStateObjectsWatchRunning, state.calculatedObjectsWatchRunning)
        ),
        running: computed(() => loadingCombine(state.calculatedRunning, parentRunning.value)),
    });
    const calculatedObjectsEffectScopes = {};

    function parentStateObjectsWatch() {
        const { addedKeys, removedKeys } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.calculatedObjects)
        );
        for (const removedKey of removedKeys) {
            delete state.calculatedObjects[removedKey];
            if (calculatedObjectsEffectScopes[removedKey]) {
                calculatedObjectsEffectScopes[removedKey].objectScope.stop();
                delete calculatedObjectsEffectScopes[removedKey];
            }
        }
        for (const addedKey of addedKeys) {
            state.calculatedObjects[addedKey] = {};
        }
        nextTick(() => {
            state.calculatedObjectsParentStateObjectsWatchRunning = false;
        });
    }

    function calculatedObjectsWatch() {
        const calculatedObjectsRulesIsEmpty = !state.calculatedObjectsRules || isEmpty(state.calculatedObjectsRules);
        for (const objectKey of Object.keys(state.calculatedObjects)) {
            if (!state.calculatedObjects[objectKey]) {
                state.calculatedObjects[objectKey] = {};
            }
            const calculatedObjectsObject = state.calculatedObjects[objectKey];
            let removedRuleKeys, addedRuleKeys;
            if (!calculatedObjectsRulesIsEmpty) {
                ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                    Object.keys(state.calculatedObjectsRules),
                    Object.keys(calculatedObjectsObject)
                ));
            } else {
                if (isEmpty(calculatedObjectsObject)) {
                    continue;
                }
                removedRuleKeys = Object.keys(calculatedObjectsObject);
                addedRuleKeys = [];
            }
            for (const removedRuleKey of removedRuleKeys) {
                if (calculatedObjectsEffectScopes[objectKey]?.ruleScopes?.[removedRuleKey]) {
                    calculatedObjectsEffectScopes[objectKey].ruleScopes[removedRuleKey].stop();
                    delete calculatedObjectsEffectScopes[objectKey].ruleScopes[removedRuleKey];
                }
            }
            if (!calculatedObjectsEffectScopes[objectKey]) {
                calculatedObjectsEffectScopes[objectKey] = {
                    objectScope: es.run(() => effectScope()),
                    ruleScopes: {},
                };
            }
            const originalObjectRef = toRef(parentState.objects, objectKey);
            const relatedObjectRef = parentState.relatedObjects
                ? toRef(parentState.relatedObjects, objectKey)
                : ref(undefined);
            calculatedObjectsEffectScopes[objectKey].objectScope.run(() => {
                for (const addedRuleKey of addedRuleKeys) {
                    const addedRuleScope = effectScope();
                    calculatedObjectsObject[addedRuleKey] = addedRuleScope.run(() =>
                        computed(() =>
                            state.calculatedObjectsRules?.[addedRuleKey]?.(
                                unref(originalObjectRef),
                                unref(relatedObjectRef),
                                calculatedObjectsObject
                            )
                        )
                    );
                    calculatedObjectsEffectScopes[objectKey].ruleScopes[addedRuleKey] = addedRuleScope;
                }
            });
        }
        nextTick(() => {
            state.calculatedObjectsWatchRunning = false;
        });
    }

    watch(
        () => Object.keys(parentState.objects),
        () => {
            state.calculatedObjectsParentStateObjectsWatchRunning = true;
        },
        { flush: "sync" }
    );
    watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
    watch(
        () => Object.keys(state.calculatedObjects),
        () => {
            state.calculatedObjectsWatchRunning = true;
        },
        { flush: "sync" }
    );
    watch(
        [
            () => Object.keys(state.calculatedObjects),
            () =>
                state.calculatedObjectsRules ? Object.keys(state.calculatedObjectsRules) : state.calculatedObjectsRules,
        ],
        calculatedObjectsWatch,
        { immediate: true }
    );

    return {
        state,
        parentState,
        stop: () => {
            es.stop();
            for (const key of Object.keys(calculatedObjectsEffectScopes)) {
                delete calculatedObjectsEffectScopes[key];
            }
        },
    };
}
