export function objectifyClasses(...classes: (CombinedClassesArgument | CombinedClassesArgument[])[]): {
    [key: string]: boolean;
};
export function combineClasses(...classes: (CombinedClassesArgument | CombinedClassesArgument[])[]): CombinedClasses;
export function stringifyClasses(...classes: (CombinedClassesArgument | CombinedClassesArgument[])[]): string;
export function stringifyClass(cls: CombinedClassesArgument | CombinedClassesArgument[] | null | undefined): string | null | undefined;
/**
 * - The normalized form of the CSS classes, either as a string of space-separated class names or an
 */
export type CombinedClasses = (string | {
    [classnames: string]: boolean | import("vue").Ref<boolean>;
} | {
    [classnames: string]: boolean | import("vue").Ref<boolean>;
}[]);
/**
 * - A boolean value or a Vue ref to a boolean.
 */
export type BooleanOrRef = boolean | import("vue").Ref<boolean>;
/**
 * - A single class-specifying argument accepted by combineClasses (a string, array, set, map, object, or ref).
 */
export type CombinedClassesArgument = string | string[] | Set<any> | Map<any, any> | object | import("vue").Ref<any>;
