import { reactive, toRef } from "vue";
import { useList } from "../../../use/list.js";
import { useListInstance } from "../../../use/listInstance.js";
import { useListSubscription } from "../../../use/listSubscription.js";
import { useListRelated } from "../../../use/listRelated.js";
import { useListCalculated } from "../../../use/listCalculated.js";
import { useListFilter } from "../../../use/listFilter.js";
import { useListSearch } from "../../../use/listSearch.js";
import { useListSort } from "../../../use/listSort.js";

vi.mock("../../../use/listInstance.js", () => ({
    useListInstance: vi.fn(),
}));
vi.mock("../../../use/listSubscription.js", () => ({
    useListSubscription: vi.fn(),
}));
vi.mock("../../../use/listRelated.js", () => ({
    useListRelated: vi.fn(),
}));
vi.mock("../../../use/listCalculated.js", () => ({
    useListCalculated: vi.fn(),
}));
vi.mock("../../../use/listFilter.js", () => ({
    useListFilter: vi.fn(),
}));
vi.mock("../../../use/listSearch.js", () => ({
    useListSearch: vi.fn(),
}));
vi.mock("../../../use/listSort.js", () => ({
    useListSort: vi.fn(),
}));

describe("use/list.js", () => {
    // todo: get better mock shapes so we don't have to use any
    /** @type {any} */
    let fakeInstance;
    /** @type {any} */
    let fakeSubscription;
    /** @type {any} */
    let fakeRelated;
    /** @type {any} */
    let fakeCalculated;
    /** @type {any} */
    let fakeFilter;
    /** @type {any} */
    let fakeSearch;
    /** @type {any} */
    let fakeSort;

    const useListInstanceMock = vi.mocked(useListInstance);
    const useListSubscriptionMock = vi.mocked(useListSubscription);
    const useListRelatedMock = vi.mocked(useListRelated);
    const useListCalculatedMock = vi.mocked(useListCalculated);
    const useListFilterMock = vi.mocked(useListFilter);
    const useListSearchMock = vi.mocked(useListSearch);
    const useListSortMock = vi.mocked(useListSort);

    beforeEach(async () => {
        vi.resetAllMocks();

        fakeInstance = {
            state: { foo: "instance" },
            list: vi.fn(),
            bulkDelete: vi.fn(),
            addListObject: vi.fn(),
            updateListObject: vi.fn(),
            deleteListObject: vi.fn(),
            executeAction: vi.fn(),
            clearList: vi.fn(),
            clearError: vi.fn(),
            getFakePk: vi.fn(),
        };
        fakeSubscription = {
            state: { foo: "subscription" },
            clearError: vi.fn(),
        };
        fakeRelated = { state: { foo: "related" } };
        fakeCalculated = { state: { foo: "calculated" } };
        fakeFilter = { state: { foo: "filter" } };
        fakeSearch = { state: { foo: "search" } };
        fakeSort = { state: { foo: "sort" } };

        useListInstanceMock.mockReturnValue(/** @type {any} */ fakeInstance);
        useListSubscriptionMock.mockReturnValue(fakeSubscription);
        useListRelatedMock.mockReturnValue(fakeRelated);
        useListCalculatedMock.mockReturnValue(fakeCalculated);
        useListFilterMock.mockReturnValue(fakeFilter);
        useListSearchMock.mockReturnValue(fakeSearch);
        useListSortMock.mockReturnValue(fakeSort);
    });

    it("wraps all the list composables and forwards their APIs", () => {
        const props = reactive({
            target: { stream: "test_stream" },
            params: { page: 1 },
            pkKey: "id",
            intendToList: true,
            intendToSubscribe: false,
            relatedObjectsRules: { r1: { pkKey: "fk", objects: {}, order: [] } },
            calculatedObjectsRules: {
                c1: () => {},
            },
            allowedFilter: (item) => !!item,
            excludedFilter: () => false,
            textSearchRules: [],
            textSearchValue: "",
            customDocumentOptions: {},
            customSearchOptions: {},
            orderByRules: [],
        });

        const list = useList({ props });

        expect(useListInstance).toHaveBeenCalledWith({ props, handlers: {} });
        expect(useListSubscription).toHaveBeenCalledWith({
            listInstance: fakeInstance,
        });
        expect(fakeSubscription.state.intendToList).toBeDefined();
        expect(fakeSubscription.state.intendToSubscribe).toBeDefined();
        expect(useListRelated).toHaveBeenCalledWith({
            parentState: fakeSubscription.state,
            relatedObjectsRules: toRef(props, "relatedObjectsRules"),
        });
        expect(useListCalculated).toHaveBeenCalledWith({
            parentState: fakeRelated.state,
            calculatedObjectsRules: toRef(props, "calculatedObjectsRules"),
        });
        expect(useListFilter).toHaveBeenCalledWith({
            parentState: fakeCalculated.state,
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });

        expect(useListSearchMock).toHaveBeenCalledWith(
            expect.objectContaining({
                parentState: fakeFilter.state,
                throttle: 500,
            })
        );

        expect(useListSortMock).toHaveBeenCalledWith(
            expect.objectContaining({
                parentState: fakeSearch.state,
                orderByRules: toRef(props, "orderByRules"),
            })
        );

        expect(list.managed.listInstance).toBe(fakeInstance);
        expect(list.managed.listSubscription).toBe(fakeSubscription);
        expect(list.managed.listRelated).toBe(fakeRelated);
        expect(list.managed.listCalculated).toBe(fakeCalculated);
        expect(list.managed.listFilter).toBe(fakeFilter);
        expect(list.managed.listSearch).toBe(fakeSearch);
        expect(list.managed.listSort).toBe(fakeSort);

        expect(list.state).toBe(fakeSort.state);

        expect(list.list).toBe(fakeInstance.list);
        expect(list.bulkDelete).toBe(fakeInstance.bulkDelete);
        expect(list.addListObject).toBe(fakeInstance.addListObject);
        expect(list.updateListObject).toBe(fakeInstance.updateListObject);
        expect(list.deleteListObject).toBe(fakeInstance.deleteListObject);
        expect(list.executeAction).toBe(fakeInstance.executeAction);
        expect(list.clearList).toBe(fakeInstance.clearList);
        expect(list.getFakePk).toBe(fakeInstance.getFakePk);

        expect(typeof list.clearError).toBe("function");
    });
});
