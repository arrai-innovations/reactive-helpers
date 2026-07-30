/** @internal */
export const relatedItemRegex = /^relatedItem\./;
/** @internal */
export const calculatedItemRegex = /^calculatedItem\./;

/**
 * The rule option names belonging to the other side's composables, mapped to the name each side
 * expects. The list composables take plural names and the object composables take singular ones.
 *
 * @internal
 */
export const ruleOptionNameForWrongSideName = {
    list: {
        relatedObjectRules: "relatedObjectsRules",
        calculatedObjectRules: "calculatedObjectsRules",
    },
    object: {
        relatedObjectsRules: "relatedObjectRules",
        calculatedObjectsRules: "calculatedObjectRules",
    },
};

/**
 * Warns when a bag of options or props carries a rule option belonging to the other side's
 * composables. The two names sit one character apart, and nothing consumes the wrong one, so the
 * layer would otherwise build empty results with no indication of why.
 *
 * @internal
 * @param {string} composableName - The composable to name in the warning.
 * @param {object|undefined} options - The options or props to check.
 * @param {"list"|"object"} side - The side whose names are correct here.
 * @returns {void}
 */
export function warnWrongSideRuleOptions(composableName, options, side) {
    if (!options) {
        return;
    }
    const wrongSide = side === "list" ? "object" : "list";
    for (const [wrongName, name] of Object.entries(ruleOptionNameForWrongSideName[side])) {
        if (options[wrongName] !== undefined) {
            console.warn(
                `[${composableName}] Ignoring "${wrongName}", which is the ${wrongSide} composables' name. Did you mean "${name}"?`
            );
        }
    }
}

/**
 * Get the object and key of a calculated item.
 *
 * @param {object} obj - The object to get the calculated item from.
 * @param {object} relatedObj - The object to get the related item from.
 * @param {object} calculatedObj - The object to get the calculated item from.
 * @param {string} key - The key to get the calculated item from.
 * @returns {[object, string]} The object and key of the calculated item.
 */
export const getObjectRelatedCalculatedByKey = (obj, relatedObj, calculatedObj, key) => {
    let getObj = obj,
        getKey = key.replace(relatedItemRegex, () => {
            getObj = relatedObj;
            return "";
        });
    if (getKey === key) {
        getKey = key.replace(calculatedItemRegex, () => {
            getObj = calculatedObj;
            return "";
        });
    }
    return [getObj, getKey];
};

/**
 * Get the object and key of a related item.
 *
 * @param {object} obj - The object to get the related item from.
 * @param {object} relatedObj - The object to get the related item from.
 * @param {string} key - The key to get the related item from.
 * @returns {[object, string]} The object and key of the related item.
 */
export const getObjectRelatedByKey = (obj, relatedObj, key) => {
    let getObj = obj,
        getKey = key.replace(relatedItemRegex, () => {
            getObj = relatedObj;
            return "";
        });
    return [getObj, getKey];
};
