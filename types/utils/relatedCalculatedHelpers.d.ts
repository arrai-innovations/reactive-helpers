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
export function getObjectRelatedCalculatedByKey(obj: object, relatedObj: object, calculatedObj: object, key: string): [object, string];
export function getObjectRelatedByKey(obj: object, relatedObj: object, key: string): [object, string];
