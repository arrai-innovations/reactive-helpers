import { useListInstance } from "./listInstance";

export function usePagedListInstance({ keepOldPages = false, useListInstanceArgs }) {
    const listInstance = useListInstance(useListInstanceArgs);

    listInstance.state.totalRecords = 0;
    listInstance.state.totalPages = 0;
    listInstance.state.perPage = 0;

    listInstance.pageCallback = (newObjects, { totalRecords, totalPages, perPage }) => {
        // with keepOldPages, you are responsible for clearing the list as needed
        if (!keepOldPages) {
            // display one page at a time, clear the list
            listInstance.clearList();
        }

        listInstance.defaultPageCallback(newObjects);
        if (totalRecords !== undefined) {
            listInstance.state.totalRecords = totalRecords;
        }
        if (totalPages !== undefined) {
            listInstance.state.totalPages = totalPages;
        }
        if (perPage !== undefined) {
            listInstance.state.perPage = perPage;
        }
    };

    return listInstance;
}
