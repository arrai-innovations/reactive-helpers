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
export function useObjectCalculateds(objectCalculatedArgs: {
    [key: string]: ObjectCalculatedOptions;
}): {
    [key: string]: ObjectCalculated;
};
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
 *     crudArgs: {},
 *     retrieveArgs: {},
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
export function useObjectCalculated({ parentState, calculatedObjectRules }: ObjectCalculatedOptions): ObjectCalculated;
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
 * @property {import('./watchesRunning.js').WatchesRunning} watchesRunning - The watches running rules.
 * @property {import('vue').EffectScope} effectScope - The effect scope.
 */
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
export const objectCalculatedStateKeys: string[];
export const objectCalculatedFunctions: any[];
/**
 * The object calculated state keys.
 */
export type ObjectCalculatedRules = {
    [ruleKey: string]: (object: any, relatedObject: any) => any;
};
/**
 * - The raw state for object calculated.
 */
export type ObjectCalculatedRawState = {
    /**
     * - The calculated object rules.
     */
    calculatedObjectRules: ObjectCalculatedRules;
    /**
     * - The calculated object.
     */
    calculatedObject: {
        [ruleKey: string]: import("vue").ComputedRef<any>;
    };
    /**
     * - Whether the calculated object watch is running.
     */
    calculatedObjectWatchRunning: boolean;
    /**
     * - Whether the parent state object watch is running.
     */
    parentStateObjectWatchRunning: boolean;
    /**
     * - Whether the calculated is running.
     */
    calculatedRunning: boolean;
    /**
     * - Whether the object calculated is running.
     */
    running: import("vue").Ref<boolean>;
};
export type ObjectCalculatedParentRawState = (import("./objectInstance.js").ObjectInstanceRawState & Partial<import("./objectSubscription.js").ObjectSubscriptionRawState> & Partial<import("./objectRelated.js").ObjectRelatedRawState>);
/**
 * - The object calculated options.
 */
export type ObjectCalculatedParentState = import("vue").UnwrapNestedRefs<(ObjectCalculatedParentRawState)>;
/**
 * The state for object calculated.
 */
export type ObjectCalculatedState = import("vue").UnwrapNestedRefs<ObjectCalculatedParentRawState & ObjectCalculatedRawState>;
/**
 * The properties for object calculated.
 */
export type ObjectCalculatedProperties = {
    /**
     * - The parent state.
     */
    parentState: ObjectCalculatedParentState;
    /**
     * - The object calculated state.
     */
    state: ObjectCalculatedState;
    /**
     * - The watches running rules.
     */
    watchesRunning: import("./watchesRunning.js").WatchesRunning;
    /**
     * - The effect scope.
     */
    effectScope: import("vue").EffectScope;
};
/**
 * The object calculated instance.
 */
export type ObjectCalculated = ObjectCalculatedProperties;
export type ObjectCalculatedRawProps = {
    /**
     * - The calculated object rules.
     */
    calculatedObjectRules: import("vue").Ref<ObjectCalculatedRules>;
};
export type ObjectCalculatedOptions = ({
    parentState: ObjectCalculatedParentState;
} & ObjectCalculatedRawProps);
//# sourceMappingURL=objectCalculated.d.ts.map