import inspect from "browser-util-inspect";
import { unref } from "vue";

window.RH_DEBUG = false;
window.RH_DEBUG_ENABLED_CATEGORIES = {};
window.RH_DEBUG_DISABLED_CATEGORIES = {};

const log = console.log;
const messageHolder = [];

/**
 * @param {String} categoriesString
 * @param {(string|Function)[]} messages
 */
const doLog = (categoriesString, messages) => {
    if (messages.length > 0) {
        for (const message of messages) {
            messageHolder.push(inspect(unref(typeof message === "function" ? message() : message)));
        }
        log(categoriesString, ...messageHolder);
        messageHolder.length = 0;
    }
};

/**
 *
 * @param {string[]} categories
 * @returns {function(...((string|Function)[]|string|Function)): void}
 */
export function useDebugMessage(categories) {
    const categoriesSet = new Set(categories);
    const categoriesString = categoriesSet.size > 0 ? `[${Array.from(categoriesSet).join(", ")}]` : "";
    return (...messages) => {
        if (!window.RH_DEBUG) {
            return;
        }
        if (categoriesSet.size > 0) {
            for (const category of categoriesSet) {
                if (window.RH_DEBUG_DISABLED_CATEGORIES[category]) {
                    return;
                }
            }
            for (const category of categoriesSet) {
                if (window.RH_DEBUG_ENABLED_CATEGORIES[category]) {
                    doLog(categoriesString, messages);
                    return;
                }
            }
        }
        if (categoriesSet.size === 0 || Object.keys(window.RH_DEBUG_ENABLED_CATEGORIES).length === 0) {
            doLog(categoriesString, messages);
        }
    };
}
