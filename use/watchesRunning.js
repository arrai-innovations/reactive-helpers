import { computed, effectScope, reactive, watch } from "vue";
import { loadingCombine } from "../utils";

export function useWatchesRunning({ triggerRef, watchSentinelRefs }) {
    const state = reactive({
        trigger: triggerRef,
        watchSentinels: watchSentinelRefs,
    });

    const es = effectScope();

    es.run(() => {
        watch(state.trigger, (value) => {
            if (value) {
                Object.keys(state.watchSentinels).forEach((key) => {
                    state.watchSentinels[key].value = true;
                });
            }
        });
        state.running = computed(() => {
            return loadingCombine(...state.watchSentinels);
        });
    });

    return {
        state,
        effectScope: es,
    };
}
