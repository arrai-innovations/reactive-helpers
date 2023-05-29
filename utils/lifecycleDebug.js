import { useDebugMessage } from "./debugMessage";
import {
    onActivated,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onDeactivated,
    onErrorCaptured,
    onMounted,
    onRenderTracked,
    onRenderTriggered,
    onServerPrefetch,
    onUnmounted,
    onUpdated,
} from "vue";

/**
 * @param {string[]} categories
 */
export function useLifecycleDebug(categories, includes = [], excludes = []) {
    const lifeCycleFns = {
        onActivated,
        onBeforeMount,
        onBeforeUnmount,
        onBeforeUpdate,
        onDeactivated,
        onErrorCaptured,
        onMounted,
        onRenderTracked,
        onRenderTriggered,
        onServerPrefetch,
        onUnmounted,
        onUpdated,
    };
    const hasIncludes = includes && includes.length > 0;
    const hasExcludes = excludes && excludes.length > 0;
    for (const key in lifeCycleFns) {
        if (hasIncludes && !includes.includes(key)) {
            continue;
        }
        if (hasExcludes && excludes.includes(key)) {
            continue;
        }
        const myCategories = new Set(categories);
        myCategories.add(key);
        const eventString = `${key} called`;
        const debugMessage = useDebugMessage(myCategories);
        lifeCycleFns[key](() => {
            debugMessage(eventString);
        });
    }
}
