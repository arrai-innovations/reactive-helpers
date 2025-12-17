import { describe, expect, it } from "vitest";
import { reactive } from "vue";
import { pkRefIfReactive, refIfReactive } from "../../../utils/refIfReactive.js";

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

    it("coerces pk from non-reactive objects with default", () => {
        const source = { pk: 7 };
        const pkComputed = pkRefIfReactive(source, "pk", "fallback");
        expect(pkComputed.value).toBe("7");

        const missingPkComputed = pkRefIfReactive({}, "pk", "fallback");
        expect(missingPkComputed.value).toBe("fallback");
    });
});
