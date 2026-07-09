import { keyDiff } from "../utils/keyDiff.js";
import { loadingCombine } from "../utils/loadingCombine.js";
import { proxyRunning } from "../utils/proxyRunning.js";
import { getObjectRelatedByKey } from "../utils/relatedCalculatedHelpers.js";
import get from "lodash-es/get.js";
import identity from "lodash-es/identity.js";
import isArray from "lodash-es/isArray.js";
import isEmpty from "lodash-es/isEmpty.js";
import isUndefined from "lodash-es/isUndefined.js";
import { computed, effectScope, nextTick, onScopeDispose, reactive, ref, toRef, toRefs, unref, watch } from "vue";

/**
 * Vue Composition API composable function for managing relationships among objects in a list.
 * It enables linking objects based on predefined rules and dynamically adjusts as the underlying data changes.
 *
 * @module use/listRelated.js
 */

// todo: pkKey is misnamed, it should be fkKey... this will be a major breaking change
/**
 * @typedef {object} ListRelatedRule - The rule for defining relationships for objects in a list.
 * @property {string} pkKey - Specifies the foreign key used to link objects across lists. Planned to be renamed to
 *  'fkKey' to better reflect its usage.
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
 * @property {() => void} stop - Stops all effects of the list related property.
 */

// if we provided functions, we would add a typedef and mix them into ListRelated

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
export function useListRelateds(listRelatedArgs) {
    /** @type {{[key: string]: ListRelated}} */
    const relateds = {};
    for (const [key, value] of Object.entries(listRelatedArgs)) {
        relateds[key] = useListRelated(value);
    }
    return relateds;
}

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
export function useListRelated({ parentState, relatedObjectsRules }) {
    const es = effectScope();
    /** @type {import('vue').Ref<boolean|undefined>} */
    const parentRunning = ref(undefined);
    proxyRunning(parentState, "running", parentRunning);
    /** @type {ListRelatedState} */
    const state = reactive(
        /** @type {ListRelatedRawState} */ {
            ...toRefs(parentState),
            relatedObjectsRules,
            relatedObjects: {},
            objAndKeyForPkAndRule: {},
            fkForPkAndRule: {},
            relatedObjectsParentStateObjectsWatchRunning: true,
            relatedObjectsWatchRunning: true,
            relatedRunning: computed(() =>
                loadingCombine(state.relatedObjectsParentStateObjectsWatchRunning, state.relatedObjectsWatchRunning)
            ),
            running: computed(() => loadingCombine(state.relatedRunning, parentRunning.value)),
        }
    );
    const relatedObjectsEffectScopes = {};

    function parentStateObjectsWatch() {
        const { addedKeys: addedIds, removedKeys: removedIds } = keyDiff(
            Object.keys(parentState.objects),
            Object.keys(state.relatedObjects)
        );
        for (const removedId of removedIds) {
            delete state.relatedObjects[removedId];
            delete state.objAndKeyForPkAndRule[removedId];
            delete state.fkForPkAndRule[removedId];
            if (relatedObjectsEffectScopes[removedId]) {
                relatedObjectsEffectScopes[removedId].objectScope.stop();
                delete relatedObjectsEffectScopes[removedId];
            }
        }
        for (const addedId of addedIds) {
            state.relatedObjects[addedId] = {};
            state.objAndKeyForPkAndRule[addedId] = {};
            state.fkForPkAndRule[addedId] = {};
        }
        nextTick(() => {
            state.relatedObjectsParentStateObjectsWatchRunning = false;
        });
    }

    function applyRuleToObject(objectKey, ruleKey, originalObjectRef, relatedObjectRef) {
        const rule = toRef(state.relatedObjectsRules, ruleKey);
        state.objAndKeyForPkAndRule[objectKey][ruleKey] = computed(() => {
            const rulePkKey = unref(rule).pkKey || ruleKey;
            const object = unref(originalObjectRef);
            const relatedObject = unref(relatedObjectRef);
            return getObjectRelatedByKey(object, relatedObject, rulePkKey);
        });

        state.fkForPkAndRule[objectKey][ruleKey] = computed(() =>
            computeForeignKey(ruleKey, objectKey, rule, relatedObjectRef)
        );

        state.relatedObjects[objectKey][ruleKey] = computed(() => {
            const value = unref(state.fkForPkAndRule[objectKey][ruleKey]);
            const objects = unref(rule).objects;
            if (isArray(value)) {
                return value.map((e) => objects[e]).filter(identity);
            }
            return objects[value];
        });
    }

    function computeForeignKey(ruleKey, objectKey, rule, relatedObjectRef) {
        const ruleOrder = unref(rule).order;
        const relatedObject = unref(relatedObjectRef);
        const [objectForGet, key] = unref(state.objAndKeyForPkAndRule[objectKey][ruleKey]);
        let value = get(objectForGet, key);
        if (objectForGet === relatedObject && isUndefined(value)) {
            // Handle nested arrays
            const firstLevelKey = key.split(".")[0];
            const firstLevelItem = get(relatedObject, firstLevelKey);
            if (isArray(firstLevelItem)) {
                const restOfKey = key.slice(firstLevelKey.length + 1);
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
    }

    function relatedObjectsWatch() {
        const relatedObjectsRulesIsEmpty = !state.relatedObjectsRules || isEmpty(state.relatedObjectsRules);
        for (const objectKey of Object.keys(state.relatedObjects)) {
            let removedRuleKeys, addedRuleKeys;
            if (!relatedObjectsRulesIsEmpty) {
                ({ removedKeys: removedRuleKeys, addedKeys: addedRuleKeys } = keyDiff(
                    Object.keys(state.relatedObjectsRules),
                    Object.keys(state.relatedObjects[objectKey])
                ));
            } else {
                if (isEmpty(state.relatedObjects[objectKey])) {
                    continue;
                }
                removedRuleKeys = new Set(Object.keys(state.relatedObjects[objectKey]));
                addedRuleKeys = new Set();
            }
            for (const removedRuleKey of removedRuleKeys) {
                relatedObjectsEffectScopes[objectKey].ruleScopes[removedRuleKey].stop();
                delete relatedObjectsEffectScopes[objectKey].ruleScopes[removedRuleKey];
                delete state.relatedObjects[objectKey][removedRuleKey];
                delete state.objAndKeyForPkAndRule[objectKey][removedRuleKey];
                delete state.fkForPkAndRule[objectKey][removedRuleKey];
            }
            if (addedRuleKeys.size) {
                if (!relatedObjectsEffectScopes[objectKey]) {
                    relatedObjectsEffectScopes[objectKey] = {
                        objectScope: es.run(() => effectScope()),
                        ruleScopes: {},
                    };
                }
                const originalObjectRef = toRef(parentState.objects, objectKey);
                const relatedObjectRef = toRef(state.relatedObjects, objectKey);
                relatedObjectsEffectScopes[objectKey].objectScope.run(() => {
                    for (const addedRuleKey of addedRuleKeys) {
                        const ruleScope = effectScope();
                        relatedObjectsEffectScopes[objectKey].ruleScopes[addedRuleKey] = ruleScope;
                        ruleScope.run(() =>
                            applyRuleToObject(objectKey, addedRuleKey, originalObjectRef, relatedObjectRef)
                        );
                    }
                });
            }
        }
        state.relatedObjectsWatchRunning = false;
    }

    es.run(() => {
        watch(
            () => Object.keys(parentState.objects),
            () => {
                state.relatedObjectsParentStateObjectsWatchRunning = true;
            },
            { flush: "sync" }
        );
        watch(() => Object.keys(parentState.objects), parentStateObjectsWatch, { immediate: true });
        watch(
            [() => Object.keys(state.relatedObjects), () => Object.keys(state.relatedObjectsRules || {})],
            () => {
                state.relatedObjectsWatchRunning = true;
            },
            { flush: "sync" }
        );
        watch(
            [() => Object.keys(state.relatedObjects), () => Object.keys(state.relatedObjectsRules || {})],
            relatedObjectsWatch,
            { immediate: true }
        );

        onScopeDispose(() => {
            for (const objectKey of Object.keys(relatedObjectsEffectScopes)) {
                delete relatedObjectsEffectScopes[objectKey];
            }
        });
    });
    return {
        state,
        parentState,
        stop: () => {
            es.stop();
            for (const objectKey of Object.keys(relatedObjectsEffectScopes)) {
                delete relatedObjectsEffectScopes[objectKey];
            }
        },
    };
}
