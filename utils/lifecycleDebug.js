import { inspectWalkFn, useDebugMessage } from "./debugMessage.js";
import { keyDiffDeep } from "./keyDiff.js";
import { transformWalk } from "./transformWalk.js";
import { isEqual, partial } from "lodash-es";
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
    unref,
} from "vue";

/**
 * Debug lifecycle hooks
 * @module utils/lifecycleDebug
 */

window.RH_DEBUG_SKIP_EMPTY_CHANGE_EFFECTS = true;

export const customHandlers = {
    onRenderTriggered: (debugMessage, e) => {
        const newSeenObjects = new Map();
        const newValue = transformWalk(e.newValue, partial(inspectWalkFn, newSeenObjects));
        const oldSeenObjects = new Map();
        const oldValue = transformWalk(e.oldValue, partial(inspectWalkFn, oldSeenObjects));
        let keyDiffResults;
        if (typeof newValue !== "object" || typeof oldValue !== "object") {
            keyDiffResults = keyDiffDeep(newValue, oldValue);
            keyDiffResults.changedKeys = new Set();
            for (const key of keyDiffResults.sameKeys) {
                // since it is a deep diff, object equality is fine to not trigger a change
                if (newValue[key] !== oldValue[key]) {
                    keyDiffResults.changedKeys.add(key);
                }
            }
            delete keyDiffResults.sameKeys;
            for (const key in keyDiffResults) {
                if (keyDiffResults[key].size === 0) {
                    delete keyDiffResults[key];
                }
            }
            if (Object.keys(keyDiffResults).length === 0 && window.RH_DEBUG_SKIP_EMPTY_CHANGE_EFFECTS) {
                return;
            }
        } else {
            if (isEqual(newValue, oldValue)) {
                return;
            }
        }
        const debugArgs = [
            {
                effect: e.effect,
                fn: e.effect.fn,
                target: unref(e.target),
                type: e.type,
                key: e.key,
                newValue,
                oldValue,
                oldTarget: unref(e.oldTarget),
            },
        ];
        if (keyDiffResults) {
            debugArgs.push(keyDiffResults);
        }
        debugMessage(...debugArgs);
    },
    onRenderTracked: (debugMessage, e) => {
        debugMessage({
            fn: e.effect.fn,
            target: unref(e.target),
            type: e.type,
            key: e.key,
        });
    },
};
const defaultHandler = (debugMessage) => {
    debugMessage();
};

/**
 * Using useDebugMessage, log lifecycle events for the current component, with the specified categories.
 * @function useLifecycleDebug
 * @param {string[]} categories - the categories to give messages this generates
 * @param {string[]} [includes] - the lifecycle functions to include
 * @param {string[]} [excludes] - the lifecycle functions to exclude
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
        myCategories.add("lifecycle");
        myCategories.add(key);
        const debugMessage = useDebugMessage(myCategories);
        lifeCycleFns[key](partial(customHandlers[key] || defaultHandler, debugMessage));
    }
}
