import { getFakePk } from "../../../utils/getFakePk.js";
import { describe, it, expect, vi, afterEach } from "vitest";

const FIRST_RANDOM = 0.1;
const SECOND_RANDOM = 0.2;
// mirrors the draw in utils/getFakePk.js so the collision cases below stay about redrawing, not about the formula.
// The formula itself is pinned by the "draws" cases at the bottom of this file.
const drawFor = (random) => Math.floor(random * (Number.MIN_SAFE_INTEGER + 1)) - 1;
const FIRST_ID = drawFor(FIRST_RANDOM);
const SECOND_ID = drawFor(SECOND_RANDOM);

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

    it("draws below zero when Math.random returns zero", () => {
        // scaling MIN_SAFE_INTEGER directly would yield Math.floor(-0), which stringifies to "0" and could collide
        //  with a server-issued key of 0.
        vi.spyOn(Math, "random").mockReturnValue(0);

        expect(getFakePk({})).toBe("-1");
    });

    it("draws a safe integer at the top of Math.random's range", () => {
        vi.spyOn(Math, "random").mockReturnValue(1 - Number.EPSILON / 2);

        const result = Number(getFakePk({}));

        expect(Number.isSafeInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(Number.MIN_SAFE_INTEGER);
    });

    it("draws a negative safe integer across the range", () => {
        for (const random of [0, Number.MIN_VALUE, 0.25, 0.5, 1 - Number.EPSILON / 2]) {
            vi.spyOn(Math, "random").mockReturnValue(random);

            const result = Number(getFakePk({}));

            expect(result).toBeLessThan(0);
            expect(Number.isSafeInteger(result)).toBe(true);
        }
    });
});
