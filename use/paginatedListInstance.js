import { useListInstance } from "./listInstance";

export function usePagedListInstance(useListInstanceArgs) {
    const listInstance = useListInstance(useListInstanceArgs);

    listInstance.state.totalRecords = 0;
    listInstance.state.totalPages = 0;
    listInstance.state.perPage = 0;

    listInstance.pageCallback = (newObjects, { totalRecords, totalPages, perPage }) => {
        // display one page at a time, clear the list
        listInstance.clearList();

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
