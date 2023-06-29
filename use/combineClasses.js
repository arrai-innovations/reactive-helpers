import { combineClasses } from "../utils/classes";
import { isReactive, isRef, ref, watch } from "vue";

export function useCombineClasses(...classes) {
    const classesComputed = ref();
    const reactiveValues = classes.filter((c) => isRef(c) && isReactive(c));
    if (!reactiveValues.length) {
        classesComputed.value = combineClasses(...classes);
    } else {
        watch(
            reactiveValues,
            () => {
                classesComputed.value = combineClasses(...classes);
            },
            {
                immediate: true,
                deep: true,
            }
        );
    }
    return classesComputed;
}
