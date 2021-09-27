import useListInstance from "./listInstance";
import useListSubscription from "./listSubscription";
import useListRelated from "./listRelated";
import useListSort from "./listSort";
import useListFilter from "./listFilter";

export function useListFulls(args) {
    const instances = {};
    for (const [key, value] of Object.entries(args)) {
        instances[key] = useListFull(value);
    }
    return instances;
}

export default function useListFull(args) {
    const listInstance = useListInstance(args);
    useListSubscription({ listInstance, ...args });
    useListRelated({ listInstance, ...args });
    useListSort({ listInstance, ...args });
    useListFilter({ listInstance, ...args });
    return listInstance;
}
