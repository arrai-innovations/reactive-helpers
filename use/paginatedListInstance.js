import { useListInstance } from "./listInstance";

export function usePagedListInstance({ crudArgs, defaultListArgs = {}, defaultRetrieveArgs = {} }) {
    const listInstance = useListInstance({ crudArgs, defaultListArgs, defaultRetrieveArgs });

    listInstance.state.count = 0;

    listInstance.pageCallback = (newObjects, count) => {
        // display one page at a time, clear the list
        listInstance.clearList();

        listInstance.defaultPageCallback(newObjects);
        if (count !== undefined) {
            listInstance.state.count = count;
        }
    };

    return listInstance;
}
