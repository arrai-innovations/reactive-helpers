import { useListInstance } from "./listInstance";

export function usePagedListInstance({ crudArgs, defaultListArgs = {}, defaultRetrieveArgs = {} }) {
    const listInstance = useListInstance({ crudArgs, defaultListArgs, defaultRetrieveArgs });

    listInstance.state.total_records = 0;
    listInstance.state.total_pages = 0;
    listInstance.state.page = 0;
    listInstance.state.per_page = 0;

    listInstance.pageCallback = (newObjects, { total_records, total_pages, page, per_page }) => {
        // display one page at a time, clear the list
        listInstance.clearList();

        listInstance.defaultPageCallback(newObjects);
        if (total_records !== undefined) {
            listInstance.state.total_records = total_records;
        }
        if (total_pages !== undefined) {
            listInstance.state.total_pages = total_pages;
        }
        if (page !== undefined) {
            listInstance.state.page = page;
        }
        if (per_page !== undefined) {
            listInstance.state.per_page = per_page;
        }
    };

    return listInstance;
}
