import { reactive, toRef } from "vue";
import { useObject, useObjects } from "../../../use/object.js";
import { useObjectInstance } from "../../../use/objectInstance.js";
import { useObjectSubscription } from "../../../use/objectSubscription.js";
import { useObjectRelated } from "../../../use/objectRelated.js";
import { useObjectCalculated } from "../../../use/objectCalculated.js";
import { scopedIt } from "../scopedIt.js";

vi.mock("../../../use/objectInstance.js", () => ({
    useObjectInstance: vi.fn(),
}));
vi.mock("../../../use/objectSubscription.js", () => ({
    useObjectSubscription: vi.fn(),
}));
vi.mock("../../../use/objectRelated.js", () => ({
    useObjectRelated: vi.fn(),
}));
vi.mock("../../../use/objectCalculated.js", () => ({
    useObjectCalculated: vi.fn(),
}));

const useObjectInstanceMock = vi.mocked(useObjectInstance);
const useObjectSubscriptionMock = vi.mocked(useObjectSubscription);
const useObjectRelatedMock = vi.mocked(useObjectRelated);
const useObjectCalculatedMock = vi.mocked(useObjectCalculated);

describe("use/object.js", () => {
    /** @type {any} */
    let fakeInstance;
    /** @type {any} */
    let fakeSubscription;
    /** @type {any} */
    let fakeRelated;
    /** @type {any} */
    let fakeCalculated;

    afterAll(() => {
        vi.restoreAllMocks();
    });

    beforeEach(() => {
        vi.resetAllMocks();
        fakeInstance = {
            state: { foo: "instance" },
            doSomething: vi.fn(),
            clear: vi.fn(),
            notFunc: true,
        };
        fakeSubscription = {
            state: { foo: "subscription" },
            subFunc: vi.fn(),
            clearError: vi.fn(),
        };
        fakeRelated = { state: { foo: "related" }, relFunc: vi.fn() };
        fakeCalculated = { state: { foo: "calculated" }, calcFunc: vi.fn(), stop: vi.fn() };

        useObjectInstanceMock.mockReturnValue(fakeInstance);
        useObjectSubscriptionMock.mockReturnValue(fakeSubscription);
        useObjectRelatedMock.mockReturnValue(fakeRelated);
        useObjectCalculatedMock.mockReturnValue(fakeCalculated);
    });

    const getProps = () => {
        return reactive({
            pkKey: "id",
            target: { args: {} },
            params: {},
            relatedObjectRules: {},
            calculatedObjectRules: {},
            intendToRetrieve: false,
            intendToSubscribe: false,
        });
    };

    scopedIt("wraps all the object composables and forwards their APIs", () => {
        const props = getProps();

        /** @type {import('../../../use/object.js').ObjectManager & {[key: string]: any}} */
        const obj = useObject({ props, handlers: {} });

        expect(useObjectInstance).toHaveBeenCalledWith({ props, handlers: {} });
        expect(useObjectSubscription).toHaveBeenCalledWith({
            objectInstance: fakeInstance,
            props,
        });
        expect(useObjectRelated).toHaveBeenCalledWith({
            parentState: fakeSubscription.state,
            relatedObjectRules: toRef(props, "relatedObjectRules"),
        });
        expect(useObjectCalculated).toHaveBeenCalledWith({
            parentState: fakeRelated.state,
            calculatedObjectRules: toRef(props, "calculatedObjectRules"),
        });

        expect(obj.managed.objectInstance).toBe(fakeInstance);
        expect(obj.managed.objectSubscription).toBe(fakeSubscription);
        expect(obj.managed.objectRelated).toBe(fakeRelated);
        expect(obj.managed.objectCalculated).toBe(fakeCalculated);
        expect(obj.state).toBe(fakeCalculated.state);

        expect(obj.doSomething).toBe(fakeInstance.doSomething);
        expect(obj.subFunc).toBe(fakeSubscription.subFunc);
        expect(obj.relFunc).toBe(fakeRelated.relFunc);
        expect(obj.calcFunc).toBe(fakeCalculated.calcFunc);
        expect(obj.notFunc).toBeUndefined();
        expect(obj.stop).not.toBe(fakeCalculated.stop);
        obj.stop();
    });

    scopedIt("delegates clear functions to subscription and instance", () => {
        const props = getProps();
        const obj = useObject({ props, handlers: {} });

        obj.clearError();
        expect(fakeSubscription.clearError).toHaveBeenCalledTimes(1);

        obj.clear();
        expect(fakeSubscription.clearError).toHaveBeenCalledTimes(2);
        expect(fakeInstance.clear).toHaveBeenCalledTimes(1);
    });

    scopedIt("creates multiple object managers with useObjects", () => {
        const mockObjectInstance = {
            state: {
                crud: {
                    args: {},
                    create: vi.fn(),
                    retrieve: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    patch: vi.fn(),
                    subscribe: vi.fn(),
                    executeAction: vi.fn(),
                },
                pk: "1",
                pkKey: "id",
                params: {},
                object: {},
                deleted: false,
                error: null,
                errored: false,
                loading: false,
            },
            clear: vi.fn(),
            create: vi.fn(),
            retrieve: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            patch: vi.fn(),
            executeAction: vi.fn(),
            clearError: vi.fn(),
        };
        useObjectInstanceMock.mockImplementation(() => mockObjectInstance);
        useObjectSubscriptionMock.mockImplementation(() => ({
            state: {
                intendToRetrieve: false,
                intendToSubscribe: false,
                subscribed: false,
                crud: {
                    args: {},
                    create: vi.fn(),
                    retrieve: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    patch: vi.fn(),
                    executeAction: vi.fn(),
                    subscribe: vi.fn(),
                },
                pk: "1",
                pkKey: "id",
                params: {},
                object: {},
                deleted: false,
                error: null,
                errored: false,
                loading: false,
            },
            objectInstance: mockObjectInstance,
            /** @type {any} */
            retrieveIntent: {},
            /** @type {any} */
            subscribeIntent: {},
            clearError: vi.fn(),
            stop: vi.fn(),
        }));
        useObjectRelatedMock.mockImplementation(() => ({
            state: {
                relatedObjectRules: {},
                relatedObject: {},
                relatedObjectWatchRunning: false,
                parentStateObjectWatchRunning: false,
                relatedRunning: false,
                running: false,
                crud: {
                    args: {},
                    create: vi.fn(),
                    retrieve: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    patch: vi.fn(),
                    subscribe: vi.fn(),
                    executeAction: vi.fn(),
                },
                pk: "1",
                pkKey: "id",
                params: {},
                object: {},
                deleted: false,
                error: null,
                errored: false,
                loading: false,
                intendToRetrieve: false,
                intendToSubscribe: false,
                subscribed: false,
            },
            parentState: mockObjectInstance.state,
            stop: vi.fn(),
        }));
        useObjectCalculatedMock.mockImplementation(() => ({
            state: {
                calculatedObjectRules: {},
                calculatedObject: {},
                calculatedObjectWatchRunning: false,
                calculatedRunning: false,
                crud: {
                    args: {},
                    create: vi.fn(),
                    retrieve: vi.fn(),
                    update: vi.fn(),
                    delete: vi.fn(),
                    patch: vi.fn(),
                    subscribe: vi.fn(),
                    executeAction: vi.fn(),
                },
                pk: "1",
                pkKey: "id",
                params: {},
                object: {},
                deleted: false,
                error: null,
                errored: false,
                loading: false,
                intendToRetrieve: false,
                intendToSubscribe: false,
                subscribed: false,
                relatedObjectRules: {},
                relatedObject: {},
                relatedObjectWatchRunning: false,
                parentStateObjectWatchRunning: false,
                relatedRunning: false,
                running: false,
            },
            parentState: mockObjectInstance.state,
            stop: vi.fn(),
        }));

        const optsA = { props: getProps(), handlers: {} };
        const optsB = { props: getProps(), handlers: {} };
        const result = useObjects({ a: optsA, b: optsB });

        expect(useObjectInstance).toHaveBeenCalledTimes(2);
        expect(useObjectInstance).toHaveBeenNthCalledWith(1, { props: optsA.props, handlers: {} });
        expect(useObjectInstance).toHaveBeenNthCalledWith(2, { props: optsB.props, handlers: {} });
        expect(Object.keys(result)).toEqual(["a", "b"]);
        expect(result.a.managed.objectInstance).toBeDefined();
        expect(result.b.managed.objectInstance).toBeDefined();
    });
});
