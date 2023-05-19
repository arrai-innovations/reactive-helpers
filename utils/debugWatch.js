import { keyDiff } from "./keyDiff";
import isEqual from "lodash-es/isEqual";
import { watch } from "vue";
import { deepUnref } from "vue-deepunref";

export const debugWatch = (target, name) => {
    return watch(
        () => deepUnref(target),
        (newState, oldState) => {
            console.log(`Watch triggered ${name}`);
            const diff = keyDiff(Object.keys(newState || {}), Object.keys(oldState || {}));
            for (const addedKey of Array.from(diff.addedKeys)) {
                console.log(`${name} added key ${addedKey}`, deepUnref(newState[addedKey]));
            }
            for (const removedKey of Array.from(diff.removedKeys)) {
                console.log(`${name} removed key ${removedKey}`, deepUnref(oldState[removedKey]));
            }
            for (const sameKey of Array.from(diff.sameKeys)) {
                if (!isEqual(deepUnref(newState[sameKey]), deepUnref(oldState[sameKey]))) {
                    console.log(`${name} same key ${sameKey}`, newState[sameKey], oldState[sameKey]);
                }
            }
        },
        {
            deep: true,
            immediate: true,
        }
    );
};
