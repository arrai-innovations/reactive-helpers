import { getFakePk } from "../../../utils/getFakePk.js";
import { describe, it, expect, vi, afterEach } from "vitest";

const FIRST_RANDOM = 0.1;
const SECOND_RANDOM = 0.2;
const FIRST_ID = Math.floor(FIRST_RANDOM * Number.MIN_SAFE_INTEGER);
const SECOND_ID = Math.floor(SECOND_RANDOM * Number.MIN_SAFE_INTEGER);

afterEach(() => {
    vi.restoreAllMocks();
});

describe("utils/getFakePk", () => {
    it("generates a unique id for sets", () => {
        const set = new Set([FIRST_ID]);
        const spy = vi.spyOn(Math, "random").mockReturnValueOnce(FIRST_RANDOM).mockReturnValueOnce(SECOND_RANDOM);

        const result = getFakePk(set);

        expect(result).toBe(String(SECOND_ID));
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it("generates a unique id for maps", () => {
        const map = new Map([[FIRST_ID, true]]);
        const spy = vi.spyOn(Math, "random").mockReturnValueOnce(FIRST_RANDOM).mockReturnValueOnce(SECOND_RANDOM);

        const result = getFakePk(map);

        expect(result).toBe(String(SECOND_ID));
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it("generates a unique id for arrays", () => {
        const array = [{ id: FIRST_ID }];
        const spy = vi.spyOn(Math, "random").mockReturnValueOnce(FIRST_RANDOM).mockReturnValueOnce(SECOND_RANDOM);

        const result = getFakePk(array);

        expect(result).toBe(String(SECOND_ID));
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it("uses the provided key for array objects", () => {
        const array = [{ pk: FIRST_ID }];
        const spy = vi.spyOn(Math, "random").mockReturnValueOnce(FIRST_RANDOM).mockReturnValueOnce(SECOND_RANDOM);

        const result = getFakePk(array, "pk");

        expect(result).toBe(String(SECOND_ID));
        expect(spy).toHaveBeenCalledTimes(2);
    });

    it("generates a unique id for plain objects", () => {
        const obj = { [FIRST_ID]: true };
        const spy = vi.spyOn(Math, "random").mockReturnValueOnce(FIRST_RANDOM).mockReturnValueOnce(SECOND_RANDOM);

        const result = getFakePk(obj);

        expect(result).toBe(String(SECOND_ID));
        expect(spy).toHaveBeenCalledTimes(2);
    });
});
