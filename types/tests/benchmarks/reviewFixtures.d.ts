/** How many entries each generated lookup collection holds. */
export const lookupSize: 13;
export function makeLookup(index: number): import("../../use/listInstance.js").ObjectsByPk;
/** Lookup collection for the array-valued rule, which resolves a list of foreign keys per record. */
export const tagLookup: import("../../use/listInstance.js").ObjectsByPk;
/** The order the array-valued rule sorts its resolved tags into. */
export const tagOrder: string[];
export function makeRelatedRules(ruleCount: number, includeArrayRule?: boolean): import("../../use/listRelated.js").ListRelatedRules;
export function makeCalculatedRules(ruleCount: number, relatedRuleCount: number): {
    [rule: string]: (object: object, related: object, calculated: object) => any;
};
export function makeReviewRows(count: number, start?: number, fkCount?: number): object[];
export function makeOrderByRules(sortOn: "none" | "plain" | "related" | "calculated"): import("../../use/listSort.js").OrderByRule[];
export function makeReviewList({ relatedRuleCount, calculatedRuleCount, sortOn, includeArrayRule, filter, sortThrottleWait, }?: ReviewListOptions): ReturnType<typeof useList>;
export function composeReviewStack({ relatedRuleCount, calculatedRuleCount, sortOn, includeArrayRule, filter, sortThrottleWait, }?: ReviewListOptions): {
    states: {
        [layer: string]: object;
    };
    push: (objects: object[]) => void;
    stop: () => void;
};
export namespace readChannels {
    let collection: {
        [channel: string]: (state: object) => void;
    };
    let record: {
        [channel: string]: (state: object, pk: string) => void;
    };
}
export function attachRenderObservers(state: object, { collectionChannels, recordChannels }?: RenderObserverOptions): {
    sync: () => void;
    stop: () => void;
    counts: {
        [channel: string]: ChannelCounts;
    };
    totals: () => {
        effects: number;
        runs: number;
        triggers: number;
    };
    reset: () => void;
};
/**
 * The shape of the review list to build.
 */
export type ReviewListOptions = {
    /**
     * How many related rules the list carries.
     */
    relatedRuleCount?: number;
    /**
     * How many calculated rules the list carries.
     */
    calculatedRuleCount?: number;
    /**
     * Which value the sort orders on.
     */
    sortOn?: "none" | "plain" | "related" | "calculated";
    /**
     * Whether the related rules include an array-valued rule.
     */
    includeArrayRule?: boolean;
    /**
     * Whether an allowed filter is active.
     */
    filter?: boolean;
    /**
     * The sort throttle, in milliseconds.
     */
    sortThrottleWait?: number;
};
/**
 * Which channels observe the list.
 */
export type RenderObserverOptions = {
    /**
     * Names from `readChannels.collection` to attach once.
     */
    collectionChannels?: string[];
    /**
     * Names from `readChannels.record` to attach per record.
     */
    recordChannels?: string[];
};
/**
 * What one channel's effects have done.
 */
export type ChannelCounts = {
    /**
     * How many effects the channel has attached.
     */
    effects: number;
    /**
     * How many times those effects have evaluated.
     */
    runs: number;
    /**
     * How many times those effects have been notified.
     */
    triggers: number;
};
import { useList } from "../../use/list.js";
