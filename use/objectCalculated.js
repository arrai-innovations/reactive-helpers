// noinspection ES6PreferShortImport
import { proxyRunning } from "../utils/proxyRunning.js";
import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { objectInstanceStateKeys } from "./objectInstance.js";
import { objectRelatedStateKeys } from "./objectRelated.js";
import { objectSubscriptionStateKeys } from "./objectSubscription.js";
import { computed, effectScope, nextTick, onScopeDispose, reactive, ref, toRef, watch } from "vue";

/**
 * Vue Composition API composable function for object calculated.
 *
 * @module use/objectCalculated.js
 */

/**
 * The object calculated state keys.
 *
 * @typedef {{
 *     [ruleKey: string]: (object: any, relatedObject: any) => any
 * }} ObjectCalculatedRules
 */

/**
 * @typedef {object} ObjectCalculatedRawState - The raw state for object calculated.
 * @property {ObjectCalculatedRules} calculatedObjectRules - The calculated object rules.
 * @property {{
 *     [ruleKey: string]: import('vue').ComputedRef<any>
 * }} calculatedObject - The calculated object.
 * @property {boolean} calculatedObjectWatchRunning - Whether the calculated object watch is running.
 * @property {boolean} parentStateObjectWatchRunning - Whether the parent state object watch is running.
 * @property {boolean} calculatedRunning - Whether the calculated is running.
 * @property {import('vue').Ref<boolean>} running - Whether the object calculated is running.
 */

/**
 *
 *
 * @typedef {(
 *     import('./objectInstance.js').ObjectInstanceRawState &
 *     Partial<import('./objectSubscription.js').ObjectSubscriptionRawState> &
 *     Partial<import('./objectRelated.js').ObjectRelatedRawState>
 * )} ObjectCalculatedParentRawState
 */

/**
 *
 *
 * @typedef {import('vue').UnwrapNestedRefs<(
 *     ObjectCalculatedParentRawState
 * )>} ObjectCalculatedParentState - The object calculated options.
 */

/**
 * The state for object calculated.
 *
 * @typedef {import('vue').UnwrapNestedRefs<
 *   ObjectCalculatedParentRawState &
 *   ObjectCalculatedRawState
 * >} ObjectCalculatedState
 */

/**
 * The properties for object calculated.
 *
 * @typedef {object} ObjectCalculatedProperties
 * @property {ObjectCalculatedParentState} parentState - The parent state.
 * @property {ObjectCalculatedState} state - The object calculated state.
 * @property {() => void} stop - Stops composition's effects and cleans up resources.
 */

// if we provided functions, we would add a typedef and mix them into ObjectCalculated

/**
 * The object calculated instance.
 *
 * @typedef {ObjectCalculatedProperties} ObjectCalculated
 */

/**
 *
 *
 * @typedef {object} ObjectCalculatedRawProps
 * @property {import('vue').Ref<ObjectCalculatedRules>} calculatedObjectRules - The calculated object rules.
 */

/**
 *
 * @typedef {({
 *     parentState: ObjectCalculatedParentState,
 * } & ObjectCalculatedRawProps)} ObjectCalculatedOptions
 */

export const objectCalculatedStateKeys = [
    "calculatedObject",
    "calculatedObjectRules",
    "calculatedObjectWatchRunning",
    "parentStateObjectWatchRunning",
    "calculatedRunning",
    // "running",
];

export const objectCalculatedFunctions = [];

/**
 * Helper function to create multiple object calculateds instances.
 *
 * @param {{
 *     [key: string]: ObjectCalculatedOptions
 * }} objectCalculatedArgs - Options for each object calculated to create.
 * @returns {{
 *    [key: string]: ObjectCalculated
 * }} - The created object calculated instances by key.
 */
export function useObjectCalculateds(objectCalculatedArgs) {
    /**
     * @type {{
     *     [key: string]: ObjectCalculated
      }} */
    const calculateds = {};
    for (const [key, value] of Object.entries(objectCalculatedArgs)) {
        calculateds[key] = useObjectCalculated(value);
    }
    return calculateds;
}

/**
 * Vue Composition API composable function for object calculated.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useObjectCalculated, useObjectSubscription } from "@arrai-innovations/reactive-helpers";
 * import { ref, reactive } from "vue";
 *
 * const objectSubscriptionProps = reactive({
 *     // whatever object subscription props you need to work with your crud implementation
 *     target: {},
 *     params: {},
 *     pk: '1',
 *     pkKey: 'id',
 *     intendToRetrieve: true,
 * };
 * const objectSubscription = useObjectSubscription(objectSubscriptionProps);
 * const objectCalculatedProps = reactive({
 *     parentState: objectSubscription.state,
 *     calculatedObjectRules: {
 *         someRule: (object, relatedObject, calculatedObjects) => {
 *            // some complex calculation, relatedObjects would be assuming there was a listRelated between the two
 *            // calculatedObjects would be the other calculated objects in the list
 *            // including yourself, so try not to create circular dependencies
 *            // this is used as a computed body.
 *            return object.someProperty + object.someOtherProperty;
 *          },
 *         ...
 *      },
 *  });
 * </script>
 * <template>
 * <div>
 *     <!-- the reactive result of the calculation, based on the fn passed in, turned into a computed -->
 *     <p>{{ objectCalculated.state.calculatedObject.someRule }}</p>
 * </div>
 * </template>
 * ```
 *
 * @param {ObjectCalculatedOptions} options - The object calculated options.
 * @returns {ObjectCalculated} - The object calculated instance.
 */
export function useObjectCalculated({ parentState, calculatedObjectRules }) {
    const es = effectScope();
    /** @type {import('vue').Ref<boolean|undefined>} */
    const parentRunning = ref(undefined);
    proxyRunning(parentState, "running", parentRunning);
    /** @type {ObjectCalculatedState} */
    // @ts-ignore - parent state keys and computeds with be added in the effect scope
    const state = reactive({
        calculatedObjectRules,
        calculatedObject: {},
        parentStateObjectWatchRunning: true,
        calculatedObjectWatchRunning: true,
        calculatedRunning: computed(() =>
            loadingCombine(state.parentStateObjectWatchRunning, state.calculatedObjectWatchRunning)
        ),
        running: computed(() => loadingCombine(state.calculatedRunning, parentRunning.value)),
    });
    const calculatedObjectEffectScopes = {};
    const calculatedObjectOriginalFunctions = {};

    es.run(() => {
        for (const key of objectInstanceStateKeys) {
            // @ts-ignore - add parent state keys programmatically, which are typescript isn't able to infer
            state[key] = toRef(parentState, key);
        }
        for (const key of objectSubscriptionStateKeys) {
            // @ts-ignore - add parent state keys programmatically, which are typescript isn't able to infer
            state[key] = toRef(parentState, key);
        }
        for (const key of objectRelatedStateKeys) {
            // @ts-ignore - add parent state keys programmatically, which are typescript isn't able to infer
            state[key] = toRef(parentState, key);
        }

        function rulesWatch() {
            /** @type {Set<string>|undefined} */
            let addedKeys = undefined,
                /** @type {Set<string>|undefined} */
                removedKeys = undefined,
                /** @type {Set<string>|undefined} */
                sameKeys = undefined;
            if (!state.calculatedObjectRules) {
                removedKeys = new Set(Object.keys(calculatedObjectOriginalFunctions));
                addedKeys = new Set();
                sameKeys = new Set();
            } else {
                ({ addedKeys, removedKeys, sameKeys } = keyDiff(
                    Object.keys(state.calculatedObjectRules),
                    Object.keys(calculatedObjectOriginalFunctions)
                ));
            }
            for (const sameKey of sameKeys) {
                if (calculatedObjectOriginalFunctions[sameKey] !== state.calculatedObjectRules[sameKey]) {
                    removedKeys.add(sameKey);
                    addedKeys.add(sameKey);
                }
            }
            for (const removedKey of removedKeys) {
                delete calculatedObjectOriginalFunctions[removedKey];
                delete state.calculatedObject[removedKey];
                if (calculatedObjectEffectScopes[removedKey]) {
                    calculatedObjectEffectScopes[removedKey].stop();
                    delete calculatedObjectEffectScopes[removedKey];
                }
            }
            for (const addedKey of addedKeys) {
                calculatedObjectOriginalFunctions[addedKey] = state.calculatedObjectRules[addedKey];
                calculatedObjectEffectScopes[addedKey] = effectScope();
                calculatedObjectEffectScopes[addedKey].run(() => {
                    state.calculatedObject[addedKey] = computed(() =>
                        calculatedObjectOriginalFunctions[addedKey](state.object, state.relatedObject)
                    );
                });
            }
            nextTick(() => {
                state.calculatedObjectWatchRunning = false;
            });
        }

        watch([() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)], rulesWatch, {
            immediate: true,
        });

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
            [() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)],
            () => {
                state.calculatedObjectWatchRunning = true;
            },
            { flush: "sync" }
        );
        watch(
            [() => state.calculatedObjectRules && Object.keys(state.calculatedObjectRules)],
            () => {
                rulesWatch();
            },
            { immediate: true }
        );

        onScopeDispose(() => {
            for (const key in calculatedObjectEffectScopes) {
                calculatedObjectEffectScopes[key].stop();
            }
            for (const key in calculatedObjectOriginalFunctions) {
                delete calculatedObjectOriginalFunctions[key];
            }
        });
    });
    return {
        state,
        parentState,
        stop: () => {
            es.stop();
            for (const key in calculatedObjectEffectScopes) {
                calculatedObjectEffectScopes[key].stop();
            }
            for (const key in calculatedObjectOriginalFunctions) {
                delete calculatedObjectOriginalFunctions[key];
            }
        },
    };
}
