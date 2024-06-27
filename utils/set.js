// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations

/**
 * Checks if one set is a superset of another set, meaning all elements of the subset are contained within the set.
 *
 * @param {Set} set - The candidate superset.
 * @param {Set} subset - The candidate subset.
 * @returns {boolean} Returns true if the set contains all elements of the subset, otherwise false.
 * @example
 * const a = new Set([1, 2, 3]);
 * const b = new Set([2, 3]);
 * console.log(isSuperset(a, b)); // true
 */
export const isSuperset = (set, subset) => {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
};

/**
 * Returns the union of two sets, containing all unique elements from both sets.
 *
 * @param {Set} setA - The first set.
 * @param {Set} setB - The second set.
 * @returns {Set} A new Set containing all elements from both input sets.
 * @example
 * const a = new Set([1, 2, 3]);
 * const b = new Set([3, 4, 5]);
 * console.log(union(a, b)); // Set(1, 2, 3, 4, 5)
 */
export const union = (setA, setB) => {
    const _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
};

/**
 * Returns the intersection of two sets, containing only elements that are present in both sets.
 *
 * @param {Set} setA - The first set.
 * @param {Set} setB - The second set.
 * @returns {Set} A new Set containing common elements from both input sets.
 * @example
 * const a = new Set([1, 2, 3]);
 * const b = new Set([2, 3, 4]);
 * console.log(intersection(a, b)); // Set(2, 3)
 */
export const intersection = (setA, setB) => {
    const _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
};

/**
 * Returns the symmetric difference of two sets, containing elements present in only one of the sets.
 *
 * @param {Set} setA - The first set.
 * @param {Set} setB - The second set.
 * @returns {Set} A new Set containing elements that are only in one of the input sets.
 * @example
 * const a = new Set([1, 2, 3]);
 * const b = new Set([3, 4, 5]);
 * console.log(symmetricDifference(a, b)); // Set(1, 2, 4, 5)
 */
export const symmetricDifference = (setA, setB) => {
    const _difference = new Set(setA);
    for (const elem of setB) {
        if (_difference.has(elem)) {
            _difference.delete(elem);
        } else {
            _difference.add(elem);
        }
    }
    return _difference;
};

/**
 * Returns the difference of two sets, containing elements present only in the first set but not in the second.
 *
 * @param {Set} setA - The first set.
 * @param {Set} setB - The second set.
 * @returns {Set} A new Set containing elements from the first set that are not in the second set.
 * @example
 * const a = new Set([1, 2, 3]);
 * const b = new Set([3, 4]);
 * console.log(difference(a, b)); // Set(1, 2)
 */
export const difference = (setA, setB) => {
    const _difference = new Set(setA);
    for (const elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
};

/**
 * Tests if two sets are equal, meaning they contain exactly the same elements.
 *
 * @param {Set} setA - The first set.
 * @param {Set} setB - The second set.
 * @returns {boolean} Returns true if both sets are equal in size and content, otherwise false.
 * @example
 * const a = new Set([1, 2, 3]);
 * const b = new Set([1, 2, 3]);
 * console.log(equals(a, b)); // true
 */
export const equals = (setA, setB) => {
    return setA.size === setB.size && isSuperset(setA, setB);
};
