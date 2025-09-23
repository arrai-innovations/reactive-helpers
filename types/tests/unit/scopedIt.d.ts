export function scopedIt(name: string, fn: () => Promise<void> | void, timeout?: number): void;
export namespace scopedIt {
    /**
     * Mark a scoped test as TODO.
     * @param {string} name - The name of the test.
     */
    export function todo(name: string): void;
    export function each(cases: any): (name: any, optionsOrFn: any, maybeFn: any) => any;
    /**
     * Run a test in a Vue effect scope with multiple cases, using `it.for`.
     * @param {Array} cases - The cases to run the test with.
     */
    function _for(cases: any[]): (name: any, maybeOptionsOrFn: any, maybeFnOrNothing: any) => void;
    export { _for as for };
}
