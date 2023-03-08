import { computed, effectScope, reactive, unref, watch } from "vue";
import { loadingCombine } from "../utils";

export function useWatchesRunning({ triggerRefs, watchSentinelRefs }) {
    const state = reactive({});

    const es = effectScope();

    es.run(() => {
        watch(
            triggerRefs,
            (values) => {
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
        state.running = computed(() => loadingCombine(watchSentinelRefs.map((ref) => ref.value)));
    });

    return {
        state,
        effectScope: es,
    };
}
