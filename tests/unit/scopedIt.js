/**
 * Run a test in a Vue effect scope.
 * @param {string} name - The name of the test.
 * @param {() => Promise<void>|void} fn - The test function.
 * @param {number} [timeout] - The timeout for the test.
 */
export const scopedIt = (name, fn, timeout) => {
    // eslint-disable-next-line vitest/expect-expect
    it(
        // eslint-disable-next-line vitest/valid-title
        name,
        async () => {
            /** @type {typeof import("vue")} */
            const { effectScope } = await vi.importActual("vue");
            const scope = effectScope();
            try {
                await scope.run(fn);
            } finally {
                scope.stop();
            }
        },
        timeout
    );
};

// Attach test modifiers: only, skip, etc.
["only", "skip", "concurrent", "sequential", "fails"].forEach((method) => {
    scopedIt[method] = (name, fn, timeout) => {
        it[method](
            name,
            async () => {
                /** @type {typeof import("vue")} */
                const { effectScope } = await vi.importActual("vue");
                const scope = effectScope();
                try {
                    await scope.run(fn);
                } finally {
                    scope.stop();
                }
            },
            timeout
        );
    };
});

/**
 * Mark a scoped test as TODO.
 * @param {string} name - The name of the test.
 */
scopedIt.todo = (name) => {
    // eslint-disable-next-line vitest/valid-title
    it.todo(name);
};

/**
 * Internal helper to create scoped `it.each` variants with optional modifiers.
 */
function createScopedEach(modifier) {
    return (cases) => {
        return (name, optionsOrFn, maybeFn) => {
            const isOptionsProvided = typeof optionsOrFn === "object" && typeof maybeFn === "function";
            const fn = isOptionsProvided ? maybeFn : optionsOrFn;
            const options = isOptionsProvided ? optionsOrFn : {};

            const baseEach = modifier ? it.each(cases)[modifier] : it.each(cases);

            return baseEach(name, options, async (...args) => {
                /** @type {typeof import("vue")} */
                const { effectScope } = await vi.importActual("vue");
                const scope = effectScope();
                try {
                    await scope.run(() => fn(...args));
                } finally {
                    scope.stop();
                }
            });
        };
    };
}

/**
 * Run a test in a Vue effect scope with multiple cases.
 * @param {Array} cases - The cases to run the test with.
 */
scopedIt.each = createScopedEach(); // base
["only", "skip", "concurrent", "sequential", "fails"].forEach((modifier) => {
    scopedIt.each[modifier] = createScopedEach(modifier);
});

/**
 * Run a test in a Vue effect scope with multiple cases, using `it.for`.
 * @param {Array} cases - The cases to run the test with.
 */
scopedIt.for = (cases) => {
    const forFn = it.for(cases);

    const register = (name, maybeOptionsOrFn, maybeFnOrNothing) => {
        const isOptionsFirst = typeof maybeOptionsOrFn === "object" && typeof maybeFnOrNothing === "function";

        const options = isOptionsFirst ? maybeOptionsOrFn : { timeout: maybeFnOrNothing };
        const fn = isOptionsFirst ? maybeFnOrNothing : maybeOptionsOrFn;

        forFn(name, options, async (arg, context) => {
            /** @type {typeof import("vue")} */
            const vue = await vi.importActual("vue");
            const scope = vue.effectScope();
            try {
                await scope.run(() => fn(arg, context));
            } finally {
                scope.stop();
            }
        });
    };

    return new Proxy(register, {
        get(target, prop, receiver) {
            return Reflect.get(forFn, prop, receiver);
        },
    });
};
