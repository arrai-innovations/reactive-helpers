/**
 * @typedef {object} ObjectRelatedProperties
 * @property {ObjectRelatedState} state - The state of the object related instance.
 * @property {ObjectRelatedParentState} parentState - The parent state.
 * @property {import('./watchesRunning.js').WatchesRunning} watchesRunning - The watches running instance.
 * @property {import('vue').EffectScope} effectScope - The effect scope.
 *
 */
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
export function useObjectRelateds(objectRelatedArgs: {
    [key: string]: ObjectRelatedOptions;
}): {
    [key: string]: ObjectRelated;
};
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
export function useObjectRelated({ parentState, relatedObjectRules }: ObjectRelatedOptions): ObjectRelated;
/**
 * Vue Composition API composable function for handling reactive relations to other objects.
 *
 * @module use/objectRelated.js
 */
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
export const objectRelatedStateKeys: string[];
export const objectRelatedFunctions: any[];
export type ObjectRelatedProperties = {
    /**
     * - The state of the object related instance.
     */
    state: ObjectRelatedState;
    /**
     * - The parent state.
     */
    parentState: ObjectRelatedParentState;
    /**
     * - The watches running instance.
     */
    watchesRunning: import("./watchesRunning.js").WatchesRunning;
    /**
     * - The effect scope.
     */
    effectScope: import("vue").EffectScope;
};
/**
 * An instance of an object related reactive object.
 */
export type ObjectRelated = ObjectRelatedProperties;
/**
 * Non-parent state options for useObjectRelated.
 */
export type ObjectRelatedRawProps = {
    /**
     * - The rules for defining relationships for the managed object to other collections of objects.
     */
    relatedObjectRules: import("vue").Ref<ObjectRelatedRawRules>;
};
/**
 * Options for useObjectRelated.
 */
export type ObjectRelatedOptions = {
    parentState: ObjectRelatedParentState;
} & ObjectRelatedRawProps;
/**
 * The rule for defining relationships for the managed object to other collections of objects.
 */
export type ObjectRelatedRule = {
    /**
     * - The key in the managed object that corresponds to the key in the related object.
     */
    pkKey: string;
    /**
     * - The related objects, indexed by the key in the related object.
     */
    objects: import("./listInstance.js").ObjectsByPk;
    /**
     * - The order of the related objects, if the related objects are an array.
     */
    order: string[];
};
/**
 * The rules for defining relationships for the managed object to other collections of objects.
 */
export type ObjectRelatedRawRules = {
    [rule: string]: ObjectRelatedRule;
};
export type ObjectRelatedRawState = {
    /**
     * - The rules for defining relationships for the managed object to other collections of objects.
     */
    relatedObjectRules: ObjectRelatedRawRules;
    /**
     * - The related objects, indexed by the key in the related object.
     */
    relatedObject: {
        [rule: string]: import("vue").ComputedRef<any>;
    };
    /**
     * - Whether the related object watch is running.
     */
    relatedObjectWatchRunning: boolean;
    /**
     * - Whether the parent state object watch is running.
     */
    parentStateObjectWatchRunning: boolean;
    /**
     * - Whether the related objects are loading.
     */
    relatedRunning: boolean;
    /**
     * - Whether the related objects are loading or the parent state is loading.
     */
    running: boolean;
};
export type ObjectRelatedParentRawState = (import("./objectInstance.js").ObjectInstanceRawState & Partial<import("./objectSubscription.js").ObjectSubscriptionRawState>);
export type ObjectRelatedParentState = import("vue").UnwrapNestedRefs<ObjectRelatedParentRawState>;
export type ObjectRelatedState = import("vue").UnwrapNestedRefs<(ObjectRelatedParentRawState & ObjectRelatedRawState)>;
//# sourceMappingURL=objectRelated.d.ts.map