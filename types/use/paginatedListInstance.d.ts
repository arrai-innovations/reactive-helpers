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
export type PaginatedRawState = {
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
    /**
     * - The page to ids map.
     */
    pageToIds: Map<number, string[]>;
};
export type PaginatedState = import("vue").UnwrapNestedRefs<PaginatedRawState>;
export type PagedListInstanceStateExtension = {
    /**
     * - The total records.
     */
    totalRecords: import("vue").Ref<number>;
    /**
     * - The total pages.
     */
    totalPages: import("vue").Ref<number>;
    /**
     * - The per page.
     */
    perPage: import("vue").Ref<number>;
    /**
     * - The page to ids map.
     */
    pageToIds: import("vue").Ref<Map<number, string[]>>;
};
export type PagedListInstanceState = typeof reactive;
export type PagedListRawInstance = {
    /**
     * - The state.
     */
    state: PagedListInstanceState;
};
export type PagedListInstance = import("./listInstance.js").ListInstance & PagedListRawInstance;
import { reactive } from "vue";
//# sourceMappingURL=paginatedListInstance.d.ts.map