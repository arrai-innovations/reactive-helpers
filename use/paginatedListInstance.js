import { useListInstance } from "./listInstance.js";

/**
 * @module use/paginatedListInstance.js
 *
 */

/**
 * @typedef {object} PagedListListanceOptions
 * @property {boolean} [keepOldPages=false] - Whether to keep old pages.
 */

/**
 * @typedef {object} PagedListInstanceState
 * @property {number} totalRecords - The total records.
 * @property {number} totalPages - The total pages.
 * @property {number} perPage - The per page.
 */

/**
 * @typedef {object} PagedListInstance
 * @property {import('./listInstance.js').ListInstanceState & PagedListInstanceState} state - The state.
 */

/**
 *
 * @param {PagedListListanceOptions & import('./listInstance.js').ListInstanceOptions} options - The options.
 * @returns {PagedListInstance} - The paged list instance.
 */
export function usePagedListInstance({ keepOldPages = false, ...useListInstanceArgs }) {
    const listInstance = /** @type {PagedListInstance & import('./listInstance.js').ListInstance} */ (
        /** @type {unknown} */ (useListInstance(useListInstanceArgs))
    );

    listInstance.state.totalRecords = 0;
    listInstance.state.totalPages = 0;
    listInstance.state.perPage = 0;

    const superClearList = listInstance.clearList;
    listInstance.clearList = () => {
        superClearList();
        listInstance.state.totalRecords = 0;
        listInstance.state.totalPages = 0;
        listInstance.state.perPage = 0;
    };

    listInstance.pageCallback = (newObjects, { totalRecords, totalPages, perPage }) => {
        // with keepOldPages, you are responsible for clearing the list as needed
        if (!keepOldPages) {
            // display one page at a time, clear the list
            listInstance.clearList();
        }
        newObjects.forEach((newObject) => {
            if (newObject.id in listInstance.state.objects) {
                listInstance.updateListObject(newObject);
            } else {
                listInstance.addListObject(newObject);
            }
        });
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
