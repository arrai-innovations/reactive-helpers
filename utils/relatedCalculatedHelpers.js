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
 * Reads a related rule's foreign key, preferring `fkKey` over the deprecated `pkKey`.
 *
 * @internal
 * @param {object|undefined} rule - The related rule to read.
 * @returns {any} The configured foreign key, or `undefined` when the rule names neither.
 */
export function ruleForeignKey(rule) {
    return rule?.fkKey ?? rule?.pkKey;
}

/**
 * Warns when a related rule names its foreign key with the deprecated `pkKey`. The option never held
 * a primary key: it names the foreign-key field on the source record. A rule setting both names is
 * still warned about, because `fkKey` silently wins and the two would otherwise disagree unnoticed.
 *
 * @internal
 * @param {string} composableName - The composable to name in the warning.
 * @param {string} ruleKey - The rule carrying the deprecated option.
 * @param {object|undefined} rule - The rule to check.
 * @param {Set<string>} warned - Rules already warned about, so each is reported once.
 * @returns {void}
 */
export function warnDeprecatedRulePkKey(composableName, ruleKey, rule, warned) {
    if (rule?.pkKey === undefined) {
        return;
    }
    if (warned.has(ruleKey)) {
        return;
    }
    warned.add(ruleKey);
    const bothNames = rule.fkKey !== undefined ? ` This rule sets both, and "fkKey" is the one used.` : "";
    console.warn(
        `[${composableName}] Rule "${ruleKey}" uses "pkKey", which is deprecated and will be removed in v25. Rename it to "fkKey", which is what the option has always meant.${bothNames}`
    );
}

/**
 * Prefixes that look like an attempt to chain a related rule off another rule's value, but are not
 * the one prefix that chains. Each is either a state property name or a near miss of `relatedItem.`.
 *
 * @internal
 */
export const wrongChainingPrefixes = [
    "relatedObject.",
    "relatedObjects.",
    "relatedItems.",
    "calculatedItem.",
    "calculatedObject.",
    "calculatedObjects.",
];

/**
 * Warns when a related rule's foreign key starts with a prefix that reads as an attempt to chain off
 * another rule. Only `relatedItem.` chains. Anything else resolves against the record, finds no such
 * field, and yields `undefined`, so the mistake looks like missing data rather than a typo.
 *
 * @internal
 * @param {string} composableName - The composable to name in the warning.
 * @param {string} ruleKey - The rule the foreign key belongs to.
 * @param {any} ruleFkKey - The rule's configured foreign key.
 * @param {Set<string>} warned - Foreign keys already warned about, so each is reported once.
 * @returns {void}
 */
export function warnWrongChainingPrefix(composableName, ruleKey, ruleFkKey, warned) {
    if (typeof ruleFkKey !== "string") {
        return;
    }
    if (!wrongChainingPrefixes.some((prefix) => ruleFkKey.startsWith(prefix))) {
        return;
    }
    const warnedKey = `${ruleKey}:${ruleFkKey}`;
    if (warned.has(warnedKey)) {
        return;
    }
    warned.add(warnedKey);
    console.warn(
        `[${composableName}] Rule "${ruleKey}" has a foreign key of "${ruleFkKey}", which resolves against the record and reads as missing data. Only "relatedItem." chains off another rule's value.`
    );
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
