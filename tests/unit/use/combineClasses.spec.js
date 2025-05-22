import { ref, reactive, nextTick } from "vue";
import { useCombineClasses } from "../../../use/combineClasses.js";
import { describe } from "vitest";
import { scopedIt } from "../scopedIt.js";

describe("use/combineClasses", () => {
    scopedIt("computes static classes once", () => {
        const arr = ["b", "c"];
        const obj = { d: true, e: false };
        const result = useCombineClasses("a", arr, obj);
        expect(result.value).toStrictEqual({ a: true, b: true, c: true, d: true, e: false });
        arr.push("f");
        obj.e = true;
        expect(result.value).toStrictEqual({ a: true, b: true, c: true, d: true, e: false });
    });

    scopedIt("updates when ref input changes", async () => {
        const cls = ref("foo");
        const result = useCombineClasses(cls, { bar: true });
        expect(result.value).toStrictEqual({ foo: true, bar: true });
        cls.value = "baz";
        await nextTick();
        expect(result.value).toStrictEqual({ baz: true, bar: true });
    });

    scopedIt("updates when reactive object changes", async () => {
        const obj = reactive({ a: true });
        const result = useCombineClasses(obj);
        expect(result.value).toStrictEqual({ a: true });
        obj.a = false;
        await nextTick();
        expect(result.value).toStrictEqual({ a: false });
    });

    scopedIt("ignores changes to static inputs with reactive ones present", async () => {
        const cls = ref("foo");
        const obj = { bar: true };
        const result = useCombineClasses(obj, cls);
        expect(result.value).toStrictEqual({ bar: true, foo: true });
        obj.bar = false;
        cls.value = "baz";
        await nextTick();
        expect(result.value).toStrictEqual({ bar: true, baz: true });
    });
});
