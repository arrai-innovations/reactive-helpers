/**
 * A reactive object for passing document options or search options to useSearch.
 *
 * @typedef {object} SearchProps
 * @property {DocumentOptions} customDocumentOptions - FlexSearch.Document options.
 * @property {SearchOptions} customSearchOptions - Search options.
 * @property {string} pkKey - The primary key field.
 */
/**
 * A reactive wrapper around FlexSearch.Index.
 *
 * @param {object} options - Options.
 * @param {SearchProps} options.props - Props.
 * @param {number} [options.throttle] - Throttle wait time.
 * @returns {SearchInstance} - The instance.
 */
export function useSearch({ props, throttle }: {
    props: SearchProps;
    throttle?: number;
}): SearchInstance;
/**
 * A reactive object for passing document options or search options to useSearch.
 */
export type SearchProps = {
    /**
     * - FlexSearch.Document options.
     */
    customDocumentOptions: DocumentOptions;
    /**
     * - Search options.
     */
    customSearchOptions: SearchOptions;
    /**
     * - The primary key field.
     */
    pkKey: string;
};
/**
 * FlexSearch.Document search options.
 */
export type SearchOptions = {
    /**
     * - Limit of results.
     */
    limit: number;
};
/**
 * Configuration options for creating a document in FlexSearch.
 */
export type DocumentOptions = {
    /**
     * - The document field to use as an identifier. Populated from `pkKey`.
     */
    id: string;
    /**
     * - The document field to use as a tag. Default is false, can be set to a string.
     */
    tag: boolean | string;
    /**
     * - Fields to index. Can be a single string, an array of strings, or an array of objects specifying custom index options.
     */
    index: string | string[] | object[];
    /**
     * - Specifies if and what document fields to store. Can be false, a string, or an array of strings. Default is false.
     */
    store: boolean | string | string[];
    /**
     * - Specifies the tokenizer to use.
     */
    tokenizer?: string;
    /**
     * - Minimum length of a token to be indexed.
     */
    minLength?: number;
};
export type SearchRawState = {
    /**
     * - The search string.
     */
    search: string;
    /**
     * - The results, where the keys are the ids of the objects that match, and the values are true.
     */
    results: object;
    /**
     * - Whether the search has been performed.
     */
    searched: boolean;
    /**
     * - Whether the search is currently running.
     */
    searching: boolean;
    /**
     * - FlexSearch.Document options.
     */
    customDocumentOptions: DocumentOptions;
    /**
     * - Search options.
     */
    customSearchOptions: SearchOptions;
    /**
     * - The number of times the search has been called.
     */
    called: number;
    /**
     * - The number of times the search has been called, but has not yet returned.
     */
    pending: number;
    /**
     * - Whether the search is currently running or has pending calls.
     */
    running: boolean;
};
export type SearchInstance = {
    /**
     * - The state.
     */
    state: import("vue").UnwrapNestedRefs<SearchRawState>;
    /**
     * - Add an index.
     */
    addIndex: Function;
    /**
     * - Update an index.
     */
    updateIndex: Function;
    /**
     * - Remove an index.
     */
    removeIndex: Function;
    /**
     * - Clear the index.
     */
    clearIndex: Function;
    /**
     * - An event target.
     */
    events: EventTarget;
    /**
     * - Stop the effect scope.
     */
    stop: Function;
};
