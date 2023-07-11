// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set#implementing_basic_set_operations

export const isSuperset = (set, subset) => {
    for (const elem of subset) {
        if (!set.has(elem)) {
            return false;
        }
    }
    return true;
};

export const union = (setA, setB) => {
    const _union = new Set(setA);
    for (let elem of setB) {
        _union.add(elem);
    }
    return _union;
};

export const intersection = (setA, setB) => {
    const _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
};

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

export const difference = (setA, setB) => {
    const _difference = new Set(setA);
    for (const elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
};

export const equals = (setA, setB) => {
    return setA.size === setB.size && isSuperset(setA, setB);
};
