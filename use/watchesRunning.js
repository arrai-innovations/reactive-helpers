import { loadingCombine, useDebugMessage } from "../utils";
import { computed, effectScope, reactive, unref, watch } from "vue";

const computedDebugMessage = useDebugMessage(new Set(["watchesRunning", "computed"]));
const watchDebugMessage = useDebugMessage(new Set(["watchesRunning", "watch"]));

export function useWatchesRunning({ triggerRefs, watchSentinelRefs }) {
    const state = reactive({});

    const es = effectScope();

    es.run(() => {
        watch(
            triggerRefs,
            (values) => {
                watchDebugMessage("useWatchesRunning triggerRefs");
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
            computedDebugMessage("useWatchesRunning running");
            return loadingCombine(values);
        });
    });

    return {
        state,
        effectScope: es,
    };
}
