import "vitest";

declare module "vitest" {
    interface Assertion<T = any> {
        toBeNullError(): void;
        toThrowErrorWithCode(
            errorClass: new (...args: any[]) => Error,
            expected?: { message?: string; code?: string }
        ): void;
    }
}
