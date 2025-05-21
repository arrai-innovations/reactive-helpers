expect.extend({
    /**
     * Custom matcher to check if a function throws an error of a specific class and has a specific message and code.
     *
     * @param {Function} errorClass - The class of the error to check for.
     * @param {Function} received - The function to execute
     * @param {object} [expected] - The expected error message and code.
     * @param {string} [expected.message] - The expected error message.
     * @param {string} [expected.code] - The expected error code.
     * @returns {object} - An object containing the result of the check and a message.
     */
    toThrowErrorWithCode(errorClass, received, expected = {}) {
        if (typeof received !== "function") {
            return {
                pass: false,
                message: () => `Expected a function to throw, but got: ${typeof received}`,
            };
        }

        let thrown;
        try {
            received();
        } catch (err) {
            thrown = err;
        }

        const className = typeof errorClass === "function" && errorClass.name ? errorClass.name : String(errorClass);

        if (!thrown) {
            return {
                pass: false,
                message: () => `Expected function to throw a ${className}, but it did not throw.`,
            };
        }

        const passInstance = thrown instanceof errorClass;
        const passMessage = expected.message === undefined || thrown.message === expected.message;
        const passCode = expected.code === undefined || thrown.code === expected.code;

        const pass = passInstance && passMessage && passCode;

        return {
            pass,
            message: () =>
                pass
                    ? `Expected function not to throw ${className}, but it did.`
                    : `Expected ${className} with ${JSON.stringify(expected)}, but got { message: "${thrown.message}", code: "${thrown.code}" }`,
        };
    },
    /**
     * Custom matcher to check if a value is null and log the error if it is not.
     *
     * @param {any} received - The value to check.
     * @returns {object} - An object containing the result of the check and a message.
     */
    toBeNullError(received) {
        const pass = received === null;

        if (pass) {
            return {
                pass: true,
                message: () => `expected value not to be null`,
            };
        }

        let formatted;
        if (received instanceof Error) {
            formatted = `${received.name}: ${received.message}`;
            if (received.stack) {
                formatted += `\n\n${received.stack}`;
            }
            console.error(received); // for dev visibility
        } else {
            formatted = String(received);
        }

        return {
            pass: false,
            message: () => `expected value to be null, but received:\n\n${formatted}`,
        };
    },
});
