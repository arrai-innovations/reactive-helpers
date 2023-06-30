import { loadingCombine } from "../utils/index.js";
import { computed, effectScope, reactive, unref, watch } from "vue";

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
        state.running = computed(() => {
            const values = watchSentinelRefs.map((ref) => ref.value);
            return loadingCombine(values);
        });
    });

    return {
        state,
        effectScope: es,
    };
}
