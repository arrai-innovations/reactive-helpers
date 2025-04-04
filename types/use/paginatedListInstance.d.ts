/**
 * @module use/paginatedListInstance.js
 *
 */
/**
 * @typedef {object} PagedListListanceOptions
 * @property {boolean} keepOldPages - Whether to keep old pages.
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
export function usePagedListInstance({ keepOldPages, ...useListInstanceArgs }: PagedListListanceOptions & import("./listInstance.js").ListInstanceOptions): PagedListInstance;
export type PagedListListanceOptions = {
    /**
     * - Whether to keep old pages.
     */
    keepOldPages: boolean;
};
export type PagedListInstanceState = {
    /**
     * - The total records.
     */
    totalRecords: number;
    /**
     * - The total pages.
     */
    totalPages: number;
    /**
     * - The per page.
     */
    perPage: number;
};
export type PagedListInstance = {
    /**
     * - The state.
     */
    state: import("./listInstance.js").ListInstanceState & PagedListInstanceState;
};
//# sourceMappingURL=paginatedListInstance.d.ts.map