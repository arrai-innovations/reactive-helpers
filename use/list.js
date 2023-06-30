import { useListCalculated } from "./listCalculated.js";
import { useListInstance } from "./listInstance.js";
import { useListRelated } from "./listRelated.js";
import { useListSubscription } from "./listSubscription.js";
import { usePagedListInstance } from "./paginatedListInstance.js";
import { effectScope, reactive, shallowReactive, shallowReadonly, toRef } from "vue";

export const useLists = (listArgs) => {
    const lists = {};
    for (const [key, value] of Object.entries(listArgs)) {
        lists[key] = useList(value);
    }
    return lists;
};

// the big brother of useObject, managing a chain of useList* instances.
export const useList = ({ props, functions, paged = false, keepOldPages = false }) => {
    const managed = shallowReactive({
        listInstance: null,
        listSubscription: null,
        listRelated: null,
        listCalculated: null,
    });

    const es = effectScope();

    es.run(() => {
        managed.listInstance = (paged ? usePagedListInstance : useListInstance)({
            props,
            functions,
            keepOldPages,
        });

        managed.listSubscription = useListSubscription({
            listInstance: managed.listInstance,
        });
        managed.listSubscription.state.intendToList = toRef(props, "intendToList");

        managed.listRelated = useListRelated({
            parentState: managed.listSubscription.state,
            relatedObjectsRules: toRef(props, "relatedObjectsRules"),
        });

        managed.listCalculated = useListCalculated({
            parentState: managed.listRelated.state,
            calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
        });
    });

    const clearError = (error) => {
        managed.listSubscription.clearError(error);
        managed.listInstance.clearError(error);
    };

    return reactive({
        // we manage the keys on both of these, so hands off the root.
        managed: shallowReadonly(managed),
        state: managed.listCalculated.state,
        list: managed.listInstance.list,
        addListObject: managed.listInstance.addListObject,
        updateListObject: managed.listInstance.updateListObject,
        deleteListObject: managed.listInstance.deleteListObject,
        clearList: managed.listInstance.clearList,
        clearError,
        getFakeId: managed.listInstance.getFakeId,
        defaultPageCallback: managed.listInstance.defaultPageCallback,
        effectScope: es,
    });
};
