/**
 * Adds to a target the missing keys from a source. `addedKeys` can be precalculated to avoid recalculation.
 *
 * @param {ValidTargetOrSource} target - The object receiving values.
 * @param {ValidTargetOrSource} source - The object providing values.
 * @param {Array} [exclude] - Keys to exclude from the addition.
 * @param {Array|Set} [addedKeys] - Precaulcated array of keys to add, if available. Otherwise, the
 * keys will be calculated.
 * @returns {boolean} True if any keys were added, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function addReactiveObject(target: ValidTargetOrSource, source: ValidTargetOrSource, exclude?: any[], addedKeys?: any[] | Set<any>): boolean;
/**
 * Updates a target with mutually shared keys from a source. `sameKeys` can be precalculated to avoid recalculation.
 *
 * @param {ValidTargetOrSource} target - The object receiving values.
 * @param {ValidTargetOrSource} source - The object providing values.
 * @param {Array} [exclude] - Keys to exclude from the update.
 * @param {Array|Set} [sameKeys] - Precaulcated array of keys to update, if available. Otherwise, the
 * keys will be calculated.
 * @returns {boolean} True if any keys were updated, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function updateReactiveObject(target: ValidTargetOrSource, source: ValidTargetOrSource, exclude?: any[], sameKeys?: any[] | Set<any>): boolean;
/**
 * Adds to a target the missing keys from a source, and updates a target with mutually shared keys from a source.
 *
 * @param {ValidTargetOrSource} target - The object receiving values.
 * @param {ValidTargetOrSource} source - The object providing values.
 * @param {Array} [exclude] - Keys to exclude from the addition or update.
 * @param {Array|Set} [addedKeys] - Precaulcated array of keys to add, if available. Otherwise, the
 * keys will be calculated.
 * @param {Array|Set} [sameKeys] - Precaulcated array of keys to update, if available. Otherwise, the
 * keys will be calculated.
 * @param {boolean} [doNotSetUndefinedKeys=true] - If true, do not update keys in the target that are undefined in the source.
 * @returns {boolean} True if any keys were added or updated, false otherwise.
 */
export function addOrUpdateReactiveObject(target: ValidTargetOrSource, source: ValidTargetOrSource, exclude?: any[], addedKeys?: any[] | Set<any>, sameKeys?: any[] | Set<any>, doNotSetUndefinedKeys?: boolean): boolean;
/**
 * Removes keys from a target that are not present in a source.
 *
 * @param {ValidTargetOrSource} target - The object receiving trimming.
 * @param {ValidTargetOrSource|null} source - The object that provides the allowed set of keys for calculating `removedKeys`.
 * @param {Array} [exclude] - Keys to exclude from removal.
 * @param {Array|Set} [removedKeys] - An array to store removed keys.
 * @returns {boolean} True if any keys were removed, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function trimReactiveObject(target: ValidTargetOrSource, source: ValidTargetOrSource | null, exclude?: any[], removedKeys?: any[] | Set<any>): boolean;
/**
 * Change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 * This function is optimized for arrays.
 *
 * @param {ValidTargetOrSource} target - The array receiving updates.
 * @param {ValidTargetOrSource} source - The reactive array to assign.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 */
export function assignReactiveArray(target: ValidTargetOrSource, source: ValidTargetOrSource): boolean;
/**
 * Change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 *
 * @param {ValidTargetOrSource} target - The target object or array.
 * @param {ValidTargetOrSource} source - The reactive object to assign.
 * @param {Array} [exclude] - Keys to exclude from the assignment.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 */
export function assignReactiveObject(target: ValidTargetOrSource, source: ValidTargetOrSource, exclude?: any[]): boolean;
/**
 * Recursively change a target to match a source, where keys missing from the source are removed from the target,
 * keys present in the source are added to the target, and keys present in both are updated in the target.
 *
 * @param {ValidTargetOrSource} target - The object receiving updates.
 * @param {ValidTargetOrSource} source - The object providing updates.
 * @param {Array} [exclude] - Keys to exclude from the assignment.
 * @returns {boolean} True if any keys were added, updated, or removed, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function assignReactiveObjectDeep(target: ValidTargetOrSource, source: ValidTargetOrSource, exclude?: any[]): boolean;
/**
 * Recursively change a target to match a source, where keys present in the source are added to the target, and
 * keys present in both are updated in the target. Missing keys are not removed.
 *
 * @param {ValidTargetOrSource} target - The object receiving updates.
 * @param {ValidTargetOrSource} source - The object providing updates.
 * @param {Array} [exclude] - Keys to exclude from the update.
 * @returns {boolean} True if any keys were added or updated, false otherwise.
 * @throws {AssignReactiveObjectError} If either target or source are not ultimately objects or arrays.
 */
export function addOrUpdateReactiveObjectDeep(target: ValidTargetOrSource, source: ValidTargetOrSource, exclude?: any[]): boolean;
/**
 * Reactive object assignment utilities.
 *
 * @module utils/assignReactiveObject.js
 */
/**
 * Error thrown when an invalid value is passed to a function.
 */
export class AssignReactiveObjectError extends Error {
    /**
     * @param {string} message - The error message.
     * @param {string} code - The error code.
     */
    constructor(message: string, code: string);
    code: string;
}
/**
 * targets and sources must be refs, objects, or arrays
 * and refs must ultimately resolve to objects or arrays
 */
export type ValidTargetOrSource = import("vue").Ref<object | any[]> | object | any[];
/**
 * The validated target and source values returned by the reactive-object assignment validator.
 */
export type validateTargetAndSourceResult = object;
