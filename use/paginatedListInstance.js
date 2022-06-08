import { useListInstance } from "./listInstance";

export function usePagedListInstance({ crudArgs, defaultListArgs = {}, defaultRetrieveArgs = {} }) {
    const listInstance = useListInstance({ crudArgs, defaultListArgs, defaultRetrieveArgs });

    listInstance.state.totalRecords = 0;
    listInstance.state.totalPages = 0;
    listInstance.state.page = 0;
    listInstance.state.perPage = 0;

    listInstance.pageCallback = (newObjects, { totalRecords, totalPages, page, perPage }) => {
        // display one page at a time, clear the list
        listInstance.clearList();

        listInstance.defaultPageCallback(newObjects);
        if (totalRecords !== undefined) {
            listInstance.state.totalRecords = totalRecords;
        }
        if (totalPages !== undefined) {
            listInstance.state.totalPages = totalPages;
        }
        if (page !== undefined) {
            listInstance.state.page = page;
        }
        if (perPage !== undefined) {
            listInstance.state.perPage = perPage;
        }
    };

    return listInstance;
}
