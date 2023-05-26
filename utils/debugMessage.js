import inspect from "browser-util-inspect";
import { unref } from "vue";

window.OFC_DEBUG = import.meta.env.MODE === "development";
window.OFC_DEBUG_ENABLED_CATEGORIES = {};
window.OFC_DEBUG_DISABLED_CATEGORIES = {};

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
 * @param {Set} categories
 * @returns {function(...((string|Function)[]|string|Function)): void}
 */
export function useDebugMessage(categories) {
    const categoriesString = categories.size > 0 ? `[${Array.from(categories).join(", ")}]` : "";
    return (...messages) => {
        if (!window.OFC_DEBUG) {
            return;
        }
        if (categories.size > 0) {
            for (const category of categories) {
                if (window.OFC_DEBUG_DISABLED_CATEGORIES[category]) {
                    return;
                }
            }
            for (const category of categories) {
                if (window.OFC_DEBUG_ENABLED_CATEGORIES[category]) {
                    doLog(categoriesString, messages);
                    return;
                }
            }
        }
        if (categories.size === 0 || Object.keys(window.OFC_DEBUG_ENABLED_CATEGORIES).length === 0) {
            doLog(categoriesString, messages);
        }
    };
}
