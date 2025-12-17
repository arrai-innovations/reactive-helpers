/**
 * Vue Composition API composable function for managing relationships among objects in a list.
 * It enables linking objects based on predefined rules and dynamically adjusts as the underlying data changes.
 *
 * @module use/listRelated.js
 */
/**
 * The rule for defining relationships for objects in a list.
 *
 * @typedef {object} ListRelatedRule
 * @property {string} pkKey - Specifies the foreign key used to link objects across lists. Planned to be renamed to
 *  'fkKey' to better reflect its usage.
 * @property {string[]} [order] - Specifies the order in which related objects should be sorted, if applicable.
 * @property {import('./listInstance.js').ObjectsByPk} objects - The objects that can be related based on the foreign key.
 */
/**
 * The rules for defining relationships among objects in a list.
 *
 * @typedef {{
 *     [rule: string]: ListRelatedRule,
 * }} ListRelatedRules
 */
/**
 * Represents the internal state used by the list related composition function. It manages and computes the relationships
 * between objects based on specified rules, providing real-time updates to related objects as the parent state changes.
 *
 * @typedef {object} ListRelatedRawState
 * @property {{
 *     [pk: import('../config/commonCrud.js').Pk]: {
 *         [rule: string]: import('vue').ComputedRef<any>,
 *     },
 * }} relatedObjects - Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.
 * @property {ListRelatedRules} relatedObjectsRules - Defines the rules for establishing relationships, such as foreign key links and sorting orders.
 * @property {{
 *     [pk: import('../config/commonCrud.js').Pk]: {
 *         [rule: string]: import('vue').ComputedRef<[object, string]>,
 *     },
 * }} objAndKeyForPkAndRule - Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.
 * @property {{
 *     [pk: import('../config/commonCrud.js').Pk]: {
 *         [rule: string]: import('vue').ComputedRef<any>,
 *     },
 * }} fkForPkAndRule - Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.
 * @property {boolean} relatedObjectsParentStateObjectsWatchRunning - Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.
 * @property {boolean} relatedObjectsWatchRunning - Indicates if watches on the related objects themselves are active, managing updates efficiently.
 * @property {boolean} relatedRunning - Signals whether any computations related to object relationships are currently in progress.
 * @property {import('vue').Ref<boolean>} running - General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.
 */
/**
 * The raw state properties for a parent of a list related property.
 *
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState>
 * )} ListRelatedParentRawState
 */
/**
 * The type for a parentState object.
 *
 * @typedef {import('vue').UnwrapNestedRefs<ListRelatedParentRawState>} ListRelatedParentState
 */
/**
 * The state for a list related property.
 *
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListRelatedParentRawState &
 *     ListRelatedRawState
 * >} ListRelatedState
 */
/**
 * The options for the list related composition function.
 *
 * @typedef {object} ListRelatedOptions
 * @property {ListRelatedParentState} parentState - The parent state object.
 * @property {import('vue').Ref<ListRelatedRules>} relatedObjectsRules - The rules for the related objects.
 */
/**
 * The properties for the list related composition function.
 *
 * @typedef {object} ListRelatedProperties
 * @property {ListRelatedState} state - The state for the list related property.
 * @property {ListRelatedParentState} parentState - The parent state object.
 * @property {() => void} stop - Stops all effects of the list related property.
 */
/**
 * An instance of `useListRelated`.
 *
 * @typedef {ListRelatedProperties} ListRelated
 */
/**
 * Creates and manages multiple instances of list-related properties, linking each to corresponding parent instances
 * based on provided configuration.
 *
 * @param {{
 *     [key: string]: ListRelatedOptions
 * }} listRelatedArgs - The options for the list related properties.
 * @returns {{[key: string]: ListRelated}} - The instances of the list related properties.
 */
export function useListRelateds(listRelatedArgs: {
    [key: string]: ListRelatedOptions;
}): {
    [key: string]: ListRelated;
};
/**
 * Initializes and returns an instance of a related objects manager. This function sets up reactive states
 * and computations that dynamically adjust as the parent list's state changes. It uses defined rules
 * for object relationships to compute and update related objects in real-time, ensuring that changes in the parent
 * state are reflected in the relationships defined by the rules.
 *
 * @example
 * ```vue
 * <script setup>
 * import { useListInstance, useListRelated } from "@arrai-innovations/reactive-helpers";
 * import { reactive, toRef } from "vue";
 *
 * const props = defineProps({
 *     someListFilter: {
 *         type: String,
 *         default: "",
 *         description: "The filter to apply to the list.",
 *     },
 *     objects: {
 *         type: Object,
 *         default: () => ({}),
 *         description: "The objects to relate to.",
 *     },
 *     order: {
 *          type: Array,
 *          default: () => [],
 *          description: "The order of the list.",
 *     },
 * });
 *
 * const listInstanceProps = reactive({
 *     target: {
 *         // whatever arguments are required for your configured list crud function to get the right endpoint
 *     },
 *     params: {
 *         // whatever arguments are required for your configured list function to get the right list
 *         someListFilter: toRef(props, "someListFilter"),
 *     },
 *     pkKey: 'id',
 *     intendToList: false,
 * });
 * listInstanceProps.intendToList = computed(()=> !!props.someListFilter);
 * const listInstance = useListInstance({ props: listInstanceProps });
 * const listRelatedProps = reactive({
 *     parentState: listInstance.state, // reactive-to-reactive so no need for toRef
 *     relatedObjectsRules: {
 *         someRule: {
 *             // this can point to a key or an array of keys to relate to
 *             pkKey: "dot.separated.key.to.pk.on.an.listInstance.object",
 *             objects: toRef(props, "objects"),
 *             order: toRef(props, "order"),
 *         },
 *     },
 * });
 * const listRelated = useListRelated(listRelatedProps);
 * </script>
 * <template>
 *     <ul>
 *         <!-- reactive list of objects, re-retrieving the list as someListFilter changes. -->
 *         <li v-for="obj in listInstance.state.objectsInOrder">
 *             {{ obj }}
 *             <div>
 *                 <!-- the related object or objects based on the rule -->
 *                 {{ listRelated.state.relatedObjects[obj.id].someRule }}
 *             </div>
 *         </li>
 *     </ul>
 * </template>
 * ```
 *
 * @param {ListRelatedOptions} options -  The configuration options including the parent state and rules for related
 *  objects.
 * @returns {ListRelated} - A reactive instance that manages related objects, providing real-time updates and
 * maintaining the integrity of object relationships as per the specified rules.
 */
export function useListRelated({ parentState, relatedObjectsRules }: ListRelatedOptions): ListRelated;
/**
 * The rule for defining relationships for objects in a list.
 */
export type ListRelatedRule = {
    /**
     * - Specifies the foreign key used to link objects across lists. Planned to be renamed to
     * 'fkKey' to better reflect its usage.
     */
    pkKey: string;
    /**
     * - Specifies the order in which related objects should be sorted, if applicable.
     */
    order?: string[];
    /**
     * - The objects that can be related based on the foreign key.
     */
    objects: import("./listInstance.js").ObjectsByPk;
};
/**
 * The rules for defining relationships among objects in a list.
 */
export type ListRelatedRules = {
    [rule: string]: ListRelatedRule;
};
/**
 * Represents the internal state used by the list related composition function. It manages and computes the relationships
 * between objects based on specified rules, providing real-time updates to related objects as the parent state changes.
 */
export type ListRelatedRawState = {
    /**
     * - Stores computed references to related objects, allowing for dynamic access based on object pk and specific rules.
     */
    relatedObjects: {
        [pk: import("../config/commonCrud.js").Pk]: {
            [rule: string]: import("vue").ComputedRef<any>;
        };
    };
    /**
     * - Defines the rules for establishing relationships, such as foreign key links and sorting orders.
     */
    relatedObjectsRules: ListRelatedRules;
    /**
     * - Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation.
     */
    objAndKeyForPkAndRule: {
        [pk: import("../config/commonCrud.js").Pk]: {
            [rule: string]: import("vue").ComputedRef<[object, string]>;
        };
    };
    /**
     * - Maintains computed references to the foreign keys for each object pk and rule, crucial for navigating complex data relationships.
     */
    fkForPkAndRule: {
        [pk: import("../config/commonCrud.js").Pk]: {
            [rule: string]: import("vue").ComputedRef<any>;
        };
    };
    /**
     * - Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.
     */
    relatedObjectsParentStateObjectsWatchRunning: boolean;
    /**
     * - Indicates if watches on the related objects themselves are active, managing updates efficiently.
     */
    relatedObjectsWatchRunning: boolean;
    /**
     * - Signals whether any computations related to object relationships are currently in progress.
     */
    relatedRunning: boolean;
    /**
     * - General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.
     */
    running: import("vue").Ref<boolean>;
};
/**
 * The raw state properties for a parent of a list related property.
 */
export type ListRelatedParentRawState = (import("./listInstance.js").ListInstanceRawState & Partial<import("./listSubscription.js").ListSubscriptionRawState>);
/**
 * The type for a parentState object.
 */
export type ListRelatedParentState = import("vue").UnwrapNestedRefs<ListRelatedParentRawState>;
/**
 * The state for a list related property.
 */
export type ListRelatedState = import("vue").UnwrapNestedRefs<ListRelatedParentRawState & ListRelatedRawState>;
/**
 * The options for the list related composition function.
 */
export type ListRelatedOptions = {
    /**
     * - The parent state object.
     */
    parentState: ListRelatedParentState;
    /**
     * - The rules for the related objects.
     */
    relatedObjectsRules: import("vue").Ref<ListRelatedRules>;
};
/**
 * The properties for the list related composition function.
 */
export type ListRelatedProperties = {
    /**
     * - The state for the list related property.
     */
    state: ListRelatedState;
    /**
     * - The parent state object.
     */
    parentState: ListRelatedParentState;
    /**
     * - Stops all effects of the list related property.
     */
    stop: () => void;
};
/**
 * An instance of `useListRelated`.
 */
export type ListRelated = ListRelatedProperties;
