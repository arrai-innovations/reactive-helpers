export function objectifyClasses(...classes: (CombinedClassesArgument | CombinedClassesArgument[])[]): {
    [key: string]: boolean;
};
export function combineClasses(...classes: (CombinedClassesArgument | CombinedClassesArgument[])[]): CombinedClasses;
export function stringifyClasses(...classes: (CombinedClassesArgument | CombinedClassesArgument[])[]): string;
export function stringifyClass(cls: ((CombinedClassesArgument | CombinedClassesArgument[]) | null | undefined)[]): string | null | undefined;
/**
 * - The normalized form of the CSS classes, either as a string of space-separated class names or an
 */
export type CombinedClasses = (string | {
    [classnames: string]: boolean | import("vue").Ref<boolean>;
} | {
    [classnames: string]: boolean | import("vue").Ref<boolean>;
}[]);
export type NestedArrayStructureWithStrings = (string | string[] | import("vue").Ref<string | string[]>);
export type BooleanOrRef = boolean | import("vue").Ref<boolean>;
export type CombinedClassesArgument = (NestedArrayStructureWithStrings | {
    [key: string]: BooleanOrRef | NestedArrayStructureWithStrings | CombinedClassesArgument;
} | import("vue").Ref<NestedArrayStructureWithStrings | {
    [key: string]: BooleanOrRef | NestedArrayStructureWithStrings | CombinedClassesArgument;
}>);
//# sourceMappingURL=classes.d.ts.map