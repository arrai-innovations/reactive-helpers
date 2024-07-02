export const relatedItemRegex = /^relatedItem\./;
export const calculatedItemRegex = /^calculatedItem\./;

/**
 * Get the object and key of a calculated item.
 *
 * @param {object} obj - The object to get the calculated item from.
 * @param {object} relatedObj - The object to get the related item from.
 * @param {object} calculatedObj - The object to get the calculated item from.
 * @param {string} key - The key to get the calculated item from.
 * @returns {[object, string]} The object and key of the calculated item.
 */
export const getObjectRelatedCalculatedByKey = (obj, relatedObj, calculatedObj, key) => {
    let getObj = obj,
        getKey = key.replace(relatedItemRegex, () => {
            getObj = relatedObj;
            return "";
        });
    if (getKey === key) {
        getKey = key.replace(calculatedItemRegex, () => {
            getObj = calculatedObj;
            return "";
        });
    }
    return [getObj, getKey];
};

/**
 * Get the object and key of a related item.
 *
 * @param {object} obj - The object to get the related item from.
 * @param {object} relatedObj - The object to get the related item from.
 * @param {string} key - The key to get the related item from.
 * @returns {[object, string]} The object and key of the related item.
 */
export const getObjectRelatedByKey = (obj, relatedObj, key) => {
    let getObj = obj,
        getKey = key.replace(relatedItemRegex, () => {
            getObj = relatedObj;
            return "";
        });
    return [getObj, getKey];
};
