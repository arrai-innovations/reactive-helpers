export const relatedItemRegex = /^relatedItem\./;
export const calculatedItemRegex = /^calculatedItem\./;

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
