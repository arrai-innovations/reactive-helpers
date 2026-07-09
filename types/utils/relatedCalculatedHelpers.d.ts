/** @internal */
export const relatedItemRegex: RegExp;
/** @internal */
export const calculatedItemRegex: RegExp;
export function getObjectRelatedCalculatedByKey(obj: object, relatedObj: object, calculatedObj: object, key: string): [object, string];
export function getObjectRelatedByKey(obj: object, relatedObj: object, key: string): [object, string];
