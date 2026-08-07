/**
 * @typedef {object} ListRelatedRule - The rule for defining relationships for objects in a list.
 * @property {string} [fkKey] - Specifies the foreign key on each row used to link objects across lists. Defaults to
 *  the rule's own key when omitted.
 * @property {string} [pkKey] - Deprecated alias for `fkKey`, removed in v24. The option never named a primary key.
 *  A rule setting both uses `fkKey`.
 * @property {string[]} [order] - Specifies the order in which related objects should be sorted, if applicable.
 * @property {import('./listInstance.js').ObjectsByPk} objects - The objects that can be related based on the foreign key.
 */
/**
 * @typedef {{
 *     [rule: string]: ListRelatedRule,
 * }} ListRelatedRules - The rules for defining relationships among objects in a list.
 */
/**
 * @typedef {object} ListRelatedRawState - Represents the internal state used by the list related composition function. It manages and computes the relationships between objects based on specified rules, providing real-time updates to related objects as the parent state changes.
 * @property {{
 *     [pk: import('../config/commonCrud.js').Pk]: {
 *         [rule: string]: any,
 *     },
 * }} relatedObjects - The related objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the related object (or array of related objects) and never carry a `.value`.
 * @property {ListRelatedRules} relatedObjectsRules - Defines the rules for establishing relationships, such as foreign key links and sorting orders.
 * @property {{
 *     [pk: import('../config/commonCrud.js').Pk]: {
 *         [rule: string]: import('vue').ComputedRef<[object, string]>,
 *     },
 * }} objAndKeyForPkAndRule - Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation. Reads through the reactive state unwrap the computed to the tuple itself, so `.value` is not used.
 * @property {{
 *     [pk: import('../config/commonCrud.js').Pk]: {
 *         [rule: string]: any,
 *     },
 * }} fkForPkAndRule - The foreign key for each object pk and rule, crucial for navigating complex data relationships. Each entry is backed by a computed that the reactive proxy unwraps on read.
 * @property {boolean} relatedObjectsParentStateObjectsWatchRunning - Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.
 * @property {boolean} relatedObjectsWatchRunning - Indicates if watches on the related objects themselves are active, managing updates efficiently.
 * @property {boolean} relatedRunning - Signals whether any computations related to object relationships are currently in progress.
 * @property {import('vue').Ref<boolean>} running - General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.
 */
/**
 * @typedef {(
 *     import('./listInstance.js').ListInstanceRawState &
 *     Partial<import('./listSubscription.js').ListSubscriptionRawState>
 * )} ListRelatedParentRawState - The raw state properties for a parent of a list related property.
 */
/**
 * @typedef {import('vue').UnwrapNestedRefs<ListRelatedParentRawState>} ListRelatedParentState - The type for a parentState object.
 */
/**
 * @typedef {import('vue').UnwrapNestedRefs<
 *     ListRelatedParentRawState &
 *     ListRelatedRawState
 * >} ListRelatedState - The state for a list related property.
 */
/**
 * @typedef {object} ListRelatedOptions - The options for the list related composition function.
 * @property {ListRelatedParentState} parentState - The parent state object.
 * @property {import('vue').Ref<ListRelatedRules>} relatedObjectsRules - The rules for the related objects.
 */
/**
 * @typedef {object} ListRelatedProperties - The properties for the list related composition function.
 * @property {ListRelatedState} state - The state for the list related property.
 * @property {ListRelatedParentState} parentState - The parent state object.
 * @property {import('../utils/watches.js').WatchMembershipChanged} watchMembershipChanged - Registers a callback for changes to the set of object keys this layer holds. The watcher belongs to the effect scope active where it is called, not to this layer, so stopping this layer silences it without disposing it.
 * @property {() => void} stop - Stops all effects of the list related property.
 */
/**
 * @typedef {ListRelatedProperties} ListRelated - An instance of `useListRelated`.
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
 *             fkKey: "dot.separated.key.to.the.foreign.key.on.a.listInstance.object",
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
export function useListRelated(options: ListRelatedOptions): ListRelated;
/**
 * Vue Composition API composable function for managing relationships among objects in a list.
 * It enables linking objects based on predefined rules and dynamically adjusts as the underlying data changes.
 *
 * @module use/listRelated.js
 */
/**
 * Defines a custom error class specific to list related rules, encapsulating details about rules that cannot be
 *  resolved as configured.
 */
export class ListRelatedError extends Error {
    /**
     * Creates an instance of ListRelatedError.
     *
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message: string, code: string);
    code: string;
}
/**
 * The rule for defining relationships for objects in a list.
 */
export type ListRelatedRule = {
    /**
     * Specifies the foreign key on each row used to link objects across lists. Defaults to
     * the rule's own key when omitted.
     */
    fkKey?: string;
    /**
     * Deprecated alias for `fkKey`, removed in v24. The option never named a primary key.
     * A rule setting both uses `fkKey`.
     */
    pkKey?: string;
    /**
     * Specifies the order in which related objects should be sorted, if applicable.
     */
    order?: string[];
    /**
     * The objects that can be related based on the foreign key.
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
 * Represents the internal state used by the list related composition function. It manages and computes the relationships between objects based on specified rules, providing real-time updates to related objects as the parent state changes.
 */
export type ListRelatedRawState = {
    /**
     * The related objects, by object pk and then rule name. Each entry is backed by a computed, but it is read through a reactive proxy that unwraps it, so reads yield the related object (or array of related objects) and never carry a `.value`.
     */
    relatedObjects: {
        [pk: import("../config/commonCrud.js").Pk]: {
            [rule: string]: any;
        };
    };
    /**
     * Defines the rules for establishing relationships, such as foreign key links and sorting orders.
     */
    relatedObjectsRules: ListRelatedRules;
    /**
     * Maps each object pk and rule to a tuple consisting of the related object and its respective key, facilitating direct data manipulation. Reads through the reactive state unwrap the computed to the tuple itself, so `.value` is not used.
     */
    objAndKeyForPkAndRule: {
        [pk: import("../config/commonCrud.js").Pk]: {
            [rule: string]: import("vue").ComputedRef<[object, string]>;
        };
    };
    /**
     * The foreign key for each object pk and rule, crucial for navigating complex data relationships. Each entry is backed by a computed that the reactive proxy unwraps on read.
     */
    fkForPkAndRule: {
        [pk: import("../config/commonCrud.js").Pk]: {
            [rule: string]: any;
        };
    };
    /**
     * Flags whether the watch on parent state objects is currently active, ensuring updates trigger as needed.
     */
    relatedObjectsParentStateObjectsWatchRunning: boolean;
    /**
     * Indicates if watches on the related objects themselves are active, managing updates efficiently.
     */
    relatedObjectsWatchRunning: boolean;
    /**
     * Signals whether any computations related to object relationships are currently in progress.
     */
    relatedRunning: boolean;
    /**
     * General flag that indicates if the list-related logic is processing, used to manage UI feedback or prevent concurrent operations.
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
     * The parent state object.
     */
    parentState: ListRelatedParentState;
    /**
     * The rules for the related objects.
     */
    relatedObjectsRules: import("vue").Ref<ListRelatedRules>;
};
/**
 * The properties for the list related composition function.
 */
export type ListRelatedProperties = {
    /**
     * The state for the list related property.
     */
    state: ListRelatedState;
    /**
     * The parent state object.
     */
    parentState: ListRelatedParentState;
    /**
     * Registers a callback for changes to the set of object keys this layer holds. The watcher belongs to the effect scope active where it is called, not to this layer, so stopping this layer silences it without disposing it.
     */
    watchMembershipChanged: import("../utils/watches.js").WatchMembershipChanged;
    /**
     * Stops all effects of the list related property.
     */
    stop: () => void;
};
/**
 * An instance of `useListRelated`.
 */
export type ListRelated = ListRelatedProperties;
