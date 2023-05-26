import { loadingCombine } from "../utils";
import { computed, effectScope, reactive, unref, watch } from "vue";

export function useWatchesRunning({ triggerRefs, watchSentinelRefs }) {
    const state = reactive({});

    const es = effectScope();

    es.run(() => {
        watch(
            triggerRefs,
            (values) => {
                console.log("useWatchesRunning triggerRefs", values, watchSentinelRefs);
                if (values.every((value) => unref(value))) {
                    watchSentinelRefs.forEach((ref) => {
                        ref.value = true;
                    });
                }
            },
            {
                immediate: true,
                deep: true,
            }
        );
        state.running = computed(() => {
            console.log(
                "useWatchesRunning running",
                watchSentinelRefs.map((ref) => ref.value)
            );
            return loadingCombine(watchSentinelRefs.map((ref) => ref.value));
        });
    });

    return {
        state,
        effectScope: es,
    };
}
