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
export function useListCalculated({ parentState, calculatedObjectsRules }: ListCalculatedOptions): ListCalculated;
/**
 * - Defines rules for dynamically calculating new properties for objects in a list. Each rule is a function that takes an object from the list, optionally its related objects, and previously calculated properties to compute a new property. These functions are reactive and re-evaluate when underlying dependencies change.
 */
export type ListCalculatedRules = {
    [rule: string]: (object: import("../use/objectInstance.js").ExistingCrudObject, relatedObject: {
        [rule: string]: any;
    }, calculatedObjects: {
        [rule: string]: import("vue").ComputedRef<any>;
    }) => any;
};
/**
 * - The raw state for a list calculated property.
 */
export type ListCalculatedRawState = {
    /**
     * - The calculated objects.
     */
    calculatedObjects: {
        [pk: import("../config/commonCrud.js").Pk]: {
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
    calculatedRunning: import("vue").ComputedRef<boolean>;
    /**
     * - Whether the list is running.
     */
    running: import("vue").ComputedRef<boolean>;
};
/**
 * - The raw parent state for a list calculated.
 */
export type ListCalculatedParentRawState = (import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState>);
/**
 * - The state for a list calculated property.
 */
export type ListCalculatedState = import("vue").UnwrapNestedRefs<ListCalculatedParentRawState & ListCalculatedRawState>;
/**
 * - Represents a combined reactive state that includes properties from list related, subscription, and instance modules.
 */
export type ListCalculatedParentState = import("vue").UnwrapNestedRefs<(import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState> & Partial<import("./listRelated.js").ListRelatedRawState>)>;
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
    calculatedObjectsRules: import("vue").Ref<ListCalculatedRules>;
};
/**
 * - The properties for the list computed composition function.
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
     * - Stops composition's effects and cleans up resources.
     */
    stop: () => void;
};
/**
 * - The instance of `useListCalculated`.
 */
export type ListCalculated = ListCalculatedProperties;
