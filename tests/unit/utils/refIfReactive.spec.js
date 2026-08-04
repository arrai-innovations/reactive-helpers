import { describe, expect, it } from "vitest";
import { reactive } from "vue";
import { normalizePk, pkRefIfReactive, refIfReactive } from "../../../utils/refIfReactive.js";

describe("normalizePk", () => {
    it.each([
        ["a string key", "42", "42"],
        ["a numeric key", 42, "42"],
        ["a numeric zero", 0, "0"],
        ["a negative key, as getFakePk mints", -12, "-12"],
        ["a boolean false", false, "false"],
        ["a boolean true", true, "true"],
    ])("coerces %s", (_label, value, expected) => {
        expect(normalizePk(value)).toBe(expected);
    });

    it.each([
        ["null", null],
        ["undefined", undefined],
        ["an empty string", ""],
        ["NaN", NaN],
    ])("reports %s as no key", (_label, value) => {
        expect(normalizePk(value)).toBeUndefined();
    });

    it("does not let an absent key coerce into a usable one", () => {
        // the trap this function exists to close: String() turns all three into truthy strings that a
        //  collection would happily store a row under
        expect([undefined, null, NaN].map(String)).toEqual(["undefined", "null", "NaN"]);
        expect([undefined, null, NaN].map(normalizePk)).toEqual([undefined, undefined, undefined]);
    });
});

describe("refIfReactive", () => {
    it("returns a ref for reactive sources", () => {
        const state = reactive({ value: 1 });
        const valueRef = refIfReactive(state, "value");
        expect(valueRef.value).toBe(1);
        state.value = 2;
        expect(valueRef.value).toBe(2);
    });

    it("returns computed with default for non-reactive sources", () => {
        const source = { value: undefined };
        const valueRef = refIfReactive(source, "value", "fallback");
        expect(valueRef.value).toBe("fallback");
    });
});

describe("pkRefIfReactive", () => {
    it("coerces numeric pk to string and tracks reactivity", () => {
        const state = reactive({ pk: 123 });
        const pkComputed = pkRefIfReactive(state);
        expect(pkComputed.value).toBe("123");
        state.pk = 456;
        expect(pkComputed.value).toBe("456");
    });

    it("returns undefined when pk is null or undefined", () => {
        const state = reactive({ pk: null });
        const pkComputed = pkRefIfReactive(state);
        expect(pkComputed.value).toBeUndefined();
        state.pk = undefined;
        expect(pkComputed.value).toBeUndefined();
    });

    it("keeps a pk of 0 or false and reads an empty string as no pk", () => {
        const state = reactive(/** @type {{ pk: string | number | boolean }} */ ({ pk: 0 }));
        const pkComputed = pkRefIfReactive(state);
        expect(pkComputed.value).toBe("0");
        state.pk = false;
        expect(pkComputed.value).toBe("false");
        state.pk = "";
        expect(pkComputed.value).toBeUndefined();
    });

    it("coerces pk from non-reactive objects with default", () => {
        const source = { pk: 7 };
        const pkComputed = pkRefIfReactive(source, "pk", "fallback");
        expect(pkComputed.value).toBe("7");

        const missingPkComputed = pkRefIfReactive({}, "pk", "fallback");
        expect(missingPkComputed.value).toBe("fallback");
    });
});
