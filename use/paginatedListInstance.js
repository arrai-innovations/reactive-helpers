import { useListInstance } from "./listInstance.js";
import { reactive, toRefs } from "vue";

/**
 * @module use/paginatedListInstance.js
 *
 */

/**
 * @typedef {object} PagedListListanceOptions
 * @property {boolean} keepOldPages - Whether to keep old pages.
 */

/**
 * @typedef {object} PaginatedRawState
 * @property {number} totalRecords - The total records.
 * @property {number} totalPages - The total pages.
 * @property {number} perPage - The per page.
 * @property {Map<number, string[]>} pageToIds - The page to ids map.
 */

/**
 * @typedef {import('vue').UnwrapNestedRefs<PaginatedRawState>} PaginatedState
 */

/**
 * @typedef {object} PagedListInstanceStateExtension
 * @property {import('vue').Ref<number>} totalRecords - The total records.
 * @property {import('vue').Ref<number>} totalPages - The total pages.
 * @property {import('vue').Ref<number>} perPage - The per page.
 * @property {import('vue').Ref<Map<number, string[]>>} pageToIds - The page to ids map.
 */

/**
 * @typedef {import('vue').reactive<(
 *     import('./listInstance.js').ListInstanceRawState &
 *     PagedListInstanceStateExtension
 * )>} PagedListInstanceState
 */

/**
 * @typedef {object} PagedListRawInstance
 * @property {PagedListInstanceState} state - The state.
 */

/**
 * @typedef {import('./listInstance.js').ListInstance & PagedListRawInstance} PagedListInstance
 */

/**
 * @param {import('./listInstance.js').ListInstance} listInstance - The list instance.
 * @param {PaginatedState} paginatedState - The paginated state.
 * @returns {PagedListInstance} - The paged list instance.
 */
function makePagedListInstance(listInstance, paginatedState) {
    Object.assign(listInstance.state, toRefs(paginatedState));
    return /** @type {PagedListInstance} */ (listInstance);
}

/**
 *
 * @param {PagedListListanceOptions & import('./listInstance.js').ListInstanceOptions} options - The options.
 * @returns {PagedListInstance} - The paged list instance.
 */
export function usePagedListInstance({ keepOldPages, ...useListInstanceArgs }) {
    /** @type {PaginatedState} */
    const paginatedState = reactive({
        totalRecords: 0,
        totalPages: 0,
        perPage: 0,
        pageToIds: new Map(),
    });

    const paginatedListInstance = makePagedListInstance(
        useListInstance({ keepOldPages, ...useListInstanceArgs }),
        paginatedState
    );

    const superClearList = paginatedListInstance.clearList;
    paginatedListInstance.clearList = () => {
        superClearList();
        paginatedState.totalRecords = 0;
        paginatedState.totalPages = 0;
        paginatedState.perPage = 0;
    };
    if (keepOldPages === undefined) {
        throw new Error("keepOldPages is required");
    }

    paginatedListInstance.pageCallback = (
        /** @type {import('./listInstance.js').ListObject[]} */ newObjects,
        /** @type {import('../config/listCrud.js').PaginateInfo} */ { page, totalRecords, totalPages, perPage }
    ) => {
        // with keepOldPages, you are responsible for clearing the list as needed
        if (!keepOldPages) {
            // display one page at a time, clear the list
            paginatedListInstance.clearList();
        }
        newObjects.forEach((newObject) => {
            if (newObject[paginatedListInstance.state.pkKey] in paginatedListInstance.state.objects) {
                paginatedListInstance.updateListObject(newObject);
            } else {
                paginatedListInstance.addListObject(newObject);
            }
        });
        if (keepOldPages && page !== undefined) {
            const pageIds = newObjects.map((obj) => obj[paginatedListInstance.state.pkKey] + "");
            // webstorm being crazy
            // noinspection JSUnresolvedReference
            paginatedState.pageToIds.set(page, pageIds);
        }
        if (totalRecords !== undefined) {
            paginatedState.totalRecords = totalRecords;
        }
        if (totalPages !== undefined) {
            paginatedState.totalPages = totalPages;
        }
        if (perPage !== undefined) {
            paginatedState.perPage = perPage;
        }
    };

    return paginatedListInstance;
}
