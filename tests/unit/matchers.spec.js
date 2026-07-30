// Coverage for the custom matchers registered in setup.js. toThrowErrorWithCode sat unused and
// broken because nothing exercised it, so the pass and fail paths are both asserted here.

class CodedError extends Error {
    /**
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message, code) {
        super(message);
        this.name = "CodedError";
        this.code = code;
    }
}

describe("toThrowErrorWithCode", () => {
    const throwCoded = () => {
        throw new CodedError("boom", "the-code");
    };

    it("passes for a matching class, message, and code", () => {
        expect(throwCoded).toThrowErrorWithCode(CodedError, { message: "boom", code: "the-code" });
    });

    it("matches on the class alone when no message or code is given", () => {
        expect(throwCoded).toThrowErrorWithCode(CodedError);
    });

    it("fails on a mismatched code", () => {
        expect(() => expect(throwCoded).toThrowErrorWithCode(CodedError, { code: "other-code" })).toThrow();
    });

    it("fails on a mismatched message", () => {
        expect(() => expect(throwCoded).toThrowErrorWithCode(CodedError, { message: "other" })).toThrow();
    });

    it("fails on a mismatched class", () => {
        expect(() => expect(throwCoded).toThrowErrorWithCode(TypeError, { code: "the-code" })).toThrow();
    });

    it("fails when the function does not throw", () => {
        expect(() => expect(() => undefined).toThrowErrorWithCode(CodedError)).toThrow();
    });

    it("fails when given something other than a function", () => {
        expect(() => expect("not a function").toThrowErrorWithCode(CodedError)).toThrow();
    });

    it("negates", () => {
        expect(throwCoded).not.toThrowErrorWithCode(CodedError, { code: "other-code" });
    });
});
