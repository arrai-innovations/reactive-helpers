/**
 * The options to create a list calculated composition function.
 *
 * @typedef {object} ListCalculatedOptions - Options to configure the behavior of the list calculated properties.
 * @property {ListCalculatedParentState} parentState - The parent state that interacts with the calculated objects.
 * @property {ListCalculatedRules} calculatedObjectsRules - A reactive reference to rules used for dynamic calculations
 *  within list objects. Proper setup of this reference ensures that updates are managed reactively, including deep
 *  property changes.
 */
/**
 * The properties for the list computed composition function.
 *
 * @typedef {object} ListCalculatedProperties
 * @property {ListCalculatedState} state - The state for the list calculated property.
 * @property {ListCalculatedParentState} parentState - The parent state object.
 * @property {import('./watchesRunning.js').WatchesRunning} watchesRunning - The watches running.
 * @property {import('vue').EffectScope} effectScope - The effect scope for the list calculated property.
 */
/**
 * The instance of `useListCalculated`.
 *
 * @typedef {ListCalculatedProperties} ListCalculated
 */
/**
 * A composable function to create multiple list calculated objects.
 *
 * @param {{
 *     [key: string]: ListCalculatedOptions
 * }} listCalculatedArgs - The arguments for the list calculated objects.
 * @returns {{[key: string]: ListCalculated}} - The list calculated objects.
 */
export function useListCalculateds(listCalculatedArgs: {
    [key: string]: ListCalculatedOptions;
}): {
    [key: string]: ListCalculated;
};
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
 *     crudArgs: {},
 *     listArgs: {},
 *     pkKey: "pk",
 *     retrieveArgs: {},
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
export function useListCalculated({ parentState, calculatedObjectsRules }: ListCalculatedOptions): ListCalculated;
/**
 * - Options to configure the behavior of the list calculated properties.
 */
export type ListCalculatedOptions = {
    /**
     * - The parent state that interacts with the calculated objects.
     */
    parentState: ListCalculatedParentState;
    /**
     * - A reactive reference to rules used for dynamic calculations
     * within list objects. Proper setup of this reference ensures that updates are managed reactively, including deep
     * property changes.
     */
    calculatedObjectsRules: ListCalculatedRules;
};
/**
 * The properties for the list computed composition function.
 */
export type ListCalculatedProperties = {
    /**
     * - The state for the list calculated property.
     */
    state: ListCalculatedState;
    /**
     * - The parent state object.
     */
    parentState: ListCalculatedParentState;
    /**
     * - The watches running.
     */
    watchesRunning: import("./watchesRunning.js").WatchesRunning;
    /**
     * - The effect scope for the list calculated property.
     */
    effectScope: import("vue").EffectScope;
};
/**
 * The instance of `useListCalculated`.
 */
export type ListCalculated = ListCalculatedProperties;
/**
 * Defines rules for dynamically calculating new properties for objects in a list. Each rule is a function that takes an
 *  object from the list, optionally its related objects, and previously calculated properties to compute a new
 *  property. These functions are reactive and re-evaluate when underlying dependencies change.
 */
export type ListCalculatedRules = import("vue").Ref<{
    [rule: string]: (object: import("./listInstance.js").ListObject, relatedObject: {
        [rule: string]: any;
    }, calculatedObjects: {
        [rule: string]: import("vue").ComputedRef<any>;
    }) => any;
}>;
/**
 * - The raw state for a list calculated property.
 */
export type ListCalculatedRawState = {
    /**
     * - The calculated objects.
     */
    calculatedObjects: {
        [pk: string]: {
            [rule: string]: import("vue").ComputedRef<any>;
        };
    };
    /**
     * - The rules for the calculated objects.
     */
    calculatedObjectsRules: ListCalculatedRules;
    /**
     * - Whether the parent state objects watch is running.
     */
    calculatedObjectsParentStateObjectsWatchRunning: boolean;
    /**
     * - Whether the calculated objects watch is running.
     */
    calculatedObjectsWatchRunning: boolean;
    /**
     * - Whether the calculated properties are running.
     */
    calculatedRunning: boolean;
    /**
     * - Whether the list is running.
     */
    running: import("vue").Ref<boolean>;
};
/**
 * The raw parent state for a list calculated.
 */
export type ListCalculatedParentRawState = (import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState>);
/**
 * The state for a list calculated property.
 */
export type ListCalculatedState = import("vue").UnwrapNestedRefs<ListCalculatedParentRawState & ListCalculatedRawState>;
/**
 * Represents a combined reactive state that includes properties from list related,
 *  subscription, and instance modules.
 */
export type ListCalculatedParentState = import("vue").UnwrapNestedRefs<(import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState>)>;
//# sourceMappingURL=listCalculated.d.ts.map