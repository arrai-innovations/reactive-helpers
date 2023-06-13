import { isSuperset } from "./set";
import { transformWalk } from "./transformWalk";
import { isSet, partial, union } from "lodash-es";
import debounce from "lodash-es/debounce";
import { unref } from "vue";

/**
 * Configurable logging of debug messages at runtime.
 * @module utils/debugMessage
 */

/**
 * Whether debug messages are enabled or not. For deploying to production with debugging but not
 * spamming everyone with debug messages.
 * @type {boolean}
 */
window.RH_DEBUG = false;

/**
 * Map of categories to whether they are enabled or not. The order of the entries are important.
 * All categories in the key must be present for the entry to match.
 * The first matching entry with a value opf true will show the message.
 * The first matching entry with a value of false will hide the message.
 * The special category "*" will match all messages.
 * Strings passed as keys will be treated as a single category.
 * Sets can also be passed as keys, which is what the arrays get converted to.
 * @type {Map<string[]|string|Set, boolean>}
 * @example
 * window.RH_DEBUG = true; // turn it on
 * window.RH_DEBUG_CATEGORIES.set(["ofc-form-component", "lifecycle"], true); // show messages matching both categories
 * window.RH_DEBUG_CATEGORIES.set(["lifecycle"], false); // turn off lifecycle messages not matching the above
 * window.RH_DEBUG_CATEGORIES.set(["dropDown"], true); // show dropDown messages except where disabled by the above
 * window.RH_DEBUG_CATEGORIES.set(["*"], false); // turn off all messages not matching the above
 */
window.RH_DEBUG_CATEGORIES = new Map();

/**
 * Group identical messages together and show a count of how many times they were logged.
 * Messages are only shown on the trailing edge, so logging is delayed and somewhat out of order.
 * @type {boolean}
 */
window.RH_DEBOUNCE_DEBUG = false;

/**
 * Whether to process arguments to be more friendly for console.log, with regard to circular references
 * and not recursing into vue components.
 * @type {boolean}
 */
window.RH_TRANSFORM_MESSAGES = true;

const DEBOUNCE_WAIT = 50;
const log = console.log;
const messageBounceFns = {};
const counts = {};

/**
 * @private
 * @param {Set} categoriesSet categories for the message log
 * @param {string} categoriesKey key for debouncing
 * @param {Array.<*>} messages messages to log
 */
const doLog = (categoriesSet, categoriesKey, messages) => {
    if (messages.length > 0) {
        const key = getKey(categoriesKey, messages);
        const count = counts[key];
        const logArgs = [Array.from(categoriesSet).join(","), ...messages];
        if (count > 1) {
            logArgs.push(`(${count})`);
        }
        log(...logArgs);
        delete counts[key];
        delete messageBounceFns[key];
    }
};

/**
 * Process a value for logging, dealing with circular references and
 * not recursing into vue components.
 * @private
 * @function inspectWalkFn
 * @param {Map} seenObjects for circlular reference detection
 * @param {string} key keys is an unused argument from walk
 * @param {*} value value to process
 * @param {string} path path to the value, used for display in circular references
 * @returns {*} processed value
 */
export const inspectWalkFn = (seenObjects, key, value, path) => {
    // return primatives as-is
    if (typeof value !== "object" || value === null) {
        return value;
    }
    if (seenObjects.has(value)) {
        return `「Dupe:${seenObjects.get(value)}」`;
    }
    seenObjects.set(value, path);
    if (value?.type?.__name) {
        // vue component instance
        return `⧼ Component:${value.type.__name} ⧽`;
    }
    return value;
};

/**
 * @private
 * @param {Array.<string | Function>} messages messages to resolve
 * @returns {Array.<*>} resolved messages
 */
const resolveMessages = (messages) => {
    const resolvedMessages = [];
    for (const message of messages) {
        let toPush = unref(typeof message === "function" ? message() : message);
        if (window.RH_TRANSFORM_MESSAGES) {
            const seenObjects = new Map();
            toPush = transformWalk(toPush, partial(inspectWalkFn, seenObjects));
        }
        resolvedMessages.push(toPush);
    }
    return resolvedMessages;
};

/**
 * @private
 * @param {Set} categoriesSet categories for the message log
 * @param {string} categoriesKey key for debouncing
 * @param {Array.<*>} messages messages to log
 * @returns {void}
 */
const doDebouncedLog = (categoriesSet, categoriesKey, messages) => {
    if (!window.RH_DEBOUNCE_DEBUG) {
        return doLog(categoriesSet, categoriesKey, messages);
    }
    const key = getKey(categoriesKey, messages);
    let debouncedLog = messageBounceFns[key];
    if (!debouncedLog) {
        debouncedLog = debounce(doLog, DEBOUNCE_WAIT, { leading: false, trailing: true });
        messageBounceFns[key] = debouncedLog;
    }
    debouncedLog(categoriesSet, categoriesKey, messages);
    counts[key] = (counts[key] || 0) + 1;
};

/**
 * @private
 * @param {string} categoriesKey categories for the message log
 * @param {Array.<string | Function>} messages messages to log
 * @returns {string} key
 */
const getKey = (categoriesKey, messages) => `${categoriesKey}|${messages.join("-")}`;

/**
 * Logs debug messages based on the specified categories and logging rules.
 * @typedef {object} DebugMessageFunction
 * @property {function(...(Array.<string | Function> | string | Function)): void} messages log a message
 */

/**
 * Returns a function that logs debug messages based on enabled categories.
 * @function useDebugMessage
 * @param {string[]} categories categories for the message log
 * @returns {DebugMessageFunction} debug message function
 */
export function useDebugMessage(categories) {
    const categoriesSet = isSet(categories) ? categories : new Set(categories);
    const sortedCategories = Array.from(categoriesSet).sort();
    const categoriesKey = categoriesSet.size > 0 ? `[${sortedCategories.join(", ")}]` : "";

    const debugMessage = (...messages) => {
        if (!window.RH_DEBUG) {
            return;
        }
        for (const [rule, enabledOrDisabled] of window.RH_DEBUG_CATEGORIES.entries()) {
            let ruleSet;
            if (Array.isArray(rule)) {
                ruleSet = new Set(rule);
            } else if (typeof rule === "string") {
                ruleSet = new Set(rule.split(","));
            } else if (rule.toString() === "[object Set]") {
                ruleSet = rule;
            } else if (rule === "*") {
                ruleSet = new Set(["*"]);
            } else {
                throw new Error(`Unexpected rule type: ${typeof rule}, ${rule}`);
            }
            // if categoriesSet is a superset of ruleSet, then apply the rule
            // first applicable rule wins
            if (isSuperset(categoriesSet, ruleSet) || ruleSet.has("*")) {
                if (enabledOrDisabled === true) {
                    doDebouncedLog(categoriesSet, categoriesKey, resolveMessages(messages));
                    return;
                } else if (enabledOrDisabled === false) {
                    return;
                }
                // ignore other values
            }
        }
        doDebouncedLog(categoriesSet, categoriesKey, resolveMessages(messages));
    };
    /**
     * @param {string[]} moreCategories categories to add
     * @returns {DebugMessageFunction} new debug message function
     */
    debugMessage.more = (moreCategories) => {
        // return a new debugMessage so the added categories are only applied to the new debugMessage
        return useDebugMessage(union(categoriesSet, isSet(moreCategories) ? moreCategories : new Set(moreCategories)));
    };
    return debugMessage;
}
