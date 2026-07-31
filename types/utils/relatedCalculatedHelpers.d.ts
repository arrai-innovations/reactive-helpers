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
 * Reads a related rule's foreign key, preferring `fkKey` over the deprecated `pkKey`.
 *
 * @internal
 * @param {object|undefined} rule - The related rule to read.
 * @returns {any} The configured foreign key, or `undefined` when the rule names neither.
 */
export function ruleForeignKey(rule: object | undefined): any;
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
export function warnDeprecatedRulePkKey(composableName: string, ruleKey: string, rule: object | undefined, warned: Set<string>): void;
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
