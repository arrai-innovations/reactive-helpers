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
export function warnWrongSideRuleOptions(composableName: string, options: object | undefined, side: "list" | "object"): void;
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
export function warnWrongChainingPrefix(composableName: string, ruleKey: string, ruleFkKey: any, warned: Set<string>): void;
/** @internal */
export const relatedItemRegex: RegExp;
/** @internal */
export const calculatedItemRegex: RegExp;
export namespace ruleOptionNameForWrongSideName {
    namespace list {
        let relatedObjectRules: string;
        let calculatedObjectRules: string;
    }
    namespace object {
        let relatedObjectsRules: string;
        let calculatedObjectsRules: string;
    }
}
/**
 * Prefixes that look like an attempt to chain a related rule off another rule's value, but are not
 * the one prefix that chains. Each is either a state property name or a near miss of `relatedItem.`.
 *
 * @internal
 */
export const wrongChainingPrefixes: string[];
export function getObjectRelatedCalculatedByKey(obj: object, relatedObj: object, calculatedObj: object, key: string): [object, string];
export function getObjectRelatedByKey(obj: object, relatedObj: object, key: string): [object, string];
