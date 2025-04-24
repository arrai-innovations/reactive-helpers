import { assignReactiveObject } from "../../../utils/assignReactiveObject.js";
import { expectErrorToBeNull } from "../expectHelpers.js";
import flushPromises from "flush-promises";
import { isRef, nextTick, reactive, ref, unref } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { CancellablePromise } from "../../../utils/cancellablePromise.js";

afterAll(() => {
    vi.restoreAllMocks();
});

const mockedUseLoadingError = vi.fn();
let currentSetError = null;
vi.mock("../../../use/loadingError.js", async () => {
    const actual = /** @type {import("../../../use/loadingError.js")} */ (
        await vi.importActual("../../../use/loadingError.js")
    );
    // we just want a way to call setError on the last run instance.
    return {
        ...actual,
        useLoadingError: mockedUseLoadingError.mockImplementation(() => {
            const real = actual.useLoadingError();
            currentSetError = real.setError;
            return real;
        }),
    };
});

describe("use/objectInstance.js", function () {
    let useObjectInstance, ObjectError, useObjectInstances, useLoadingError;
    beforeAll(async () => {
        const imported = await import("../../../use/objectInstance.js");
        useObjectInstance = imported.useObjectInstance;
        ObjectError = imported.ObjectError;
        useObjectInstances = imported.useObjectInstances;
        const loadingErrorImported = await import("../../../use/loadingError.js");
        useLoadingError = loadingErrorImported.useLoadingError;
    });
    afterEach(function () {
        vi.clearAllMocks();
    });
    const crudRetrieveResolved = {
        id: 1,
        __str__: "asdf",
        name: "zxcv",
    };
    const crudRetrieveResolvedNonStandardPrimaryKey = {
        unique: 1,
        __str__: "test",
        name: "test",
    };
    const crudRetrieveRejected = {
        errors: ["Not found"],
        data: null,
        action: "retrieve",
        response_status: 404,
        request_id: "60799141-959a-4ff7-80bc-1ad6b805a8fd",
    };
    const crudCreateResolved = {
        id: 1,
        __str__: "tset",
        name: "tset",
    };
    const crudCreateResolvedNonStandardPK = {
        unique: 1,
        __str__: "tset",
        name: "tset",
    };
    const crudCreateRejected = {
        errors: [
            {
                name: ["Test object with this name already exists."],
            },
        ],
        data: null,
        action: "create",
        response_status: 400,
        request_id: "60799141-959a-4ff7-80bc-1ad6b805a8fd",
    };
    const crudUpdateResolved = {
        id: 1,
        __str__: "asdf!",
        name: "zxcv!",
    };
    const crudUpdateResolvedWithNonStandardPk = {
        unique: 1,
        __str__: "asdf!",
        name: "zxcv!",
    };
    const crudUpdateRejected = {
        errors: [
            {
                name: ["Test object with this name already exists."],
            },
        ],
        data: null,
        action: "update",
        response_status: 400,
        request_id: "60799141-959a-4ff7-80bc-1ad6b805a8fd",
    };
    const crudPatchResolved = {
        id: 1,
        __str__: "asdf!",
        name: "zxcv!",
    };
    const crudPatchResolvedWithNonStandardPk = {
        unique: 1,
        __str__: "asdf!",
        name: "zxcv!",
    };
    const crudPatchRejected = {
        errors: [
            {
                name: ["Test object with this name already exists."],
            },
        ],
        data: null,
        action: "patch",
        response_status: 400,
        request_id: "60799141-959a-4ff7-80bc-1ad6b805a8fd",
    };
    const crudDeleteResolved = {
        errors: [],
        data: null,
        action: "delete",
        response_status: 204,
        request_id: "454619de-6687-4664-ad2a-67cdb393eb70",
    };
    const crudDeleteRejected = {
        errors: ["You cannot delete this object at this time."],
        data: null,
        action: "delete",
        response_status: 400,
        request_id: "454619de-6687-4664-ad2a-67cdb393eb70",
    };
    const fields = ["id", "__str__", "name"];
    describe("retrieve", function () {
        it("success", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.retrieve = vi.fn();
            let crudRetrieveResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudRetrieveResolve is set in the promise, so it will be defined
            crudRetrieveResolve(crudRetrieveResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(false);
            await nextTick();
            await expect(oiRetrieveResolve).resolves.toBe(true);
        });
        it("success with non-standard pk", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "unique",
                    params,
                },
            });
            objectInstance.state.crud.retrieve = vi.fn();
            let crudRetrieveResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudRetrieveResolve is set in the promise, so it will be defined
            crudRetrieveResolve(crudRetrieveResolvedNonStandardPrimaryKey);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolvedNonStandardPrimaryKey);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "unique",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(false);
            await nextTick();
            await expect(oiRetrieveResolve).resolves.toBe(true);
        });
        it("success (params)", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.retrieve = vi.fn();
            let crudRetrieveResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudRetrieveResolve is set in the promise, so it will be defined
            crudRetrieveResolve(crudRetrieveResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(true);
        });
        it("errored", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.retrieve = vi.fn();
            let crudRetrieveReject;
            const crudRetrievePromise = new Promise((resolve, reject) => {
                crudRetrieveReject = reject;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudRetrieveReject is set in the promise, so it will be defined
            crudRetrieveReject(crudRetrieveRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudRetrieveRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(false);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(false);
        });
        it("errored with non-matching pkKey", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "pk",
                    params,
                },
            });
            objectInstance.state.crud.retrieve = vi.fn();
            let crudRetrieveReject;
            const crudRetrievePromise = new Promise((resolve, reject) => {
                crudRetrieveReject = reject;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudRetrieveReject is set in the promise, so it will be defined
            crudRetrieveReject(crudRetrieveRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudRetrieveRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "pk",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(false);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            objectInstance.state.crud.create.mockImplementation(() => new Promise(() => {}));
            objectInstance.state.crud.retrieve = vi.fn();
            objectInstance.state.crud.retrieve.mockImplementation(() => new Promise(() => {}));
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.create({
                fake: "object",
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(() => objectInstance.retrieve()).toThrow(new ObjectError("already loading.", "already-loading"));
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(0);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
        it("double retrieve gets the same promise", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.retrieve = vi.fn();
            objectInstance.state.crud.retrieve.mockImplementation(() => new Promise(() => {}));
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const firstPromise = objectInstance.retrieve();
            const secondPromise = objectInstance.retrieve();
            expect(firstPromise).toBe(secondPromise);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(false);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
        it("cancel", async () => {
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: { fields },
                },
            });

            let cancelFnCalled = false;
            const testPromise = CancellablePromise(new Promise(() => {}), () => {
                cancelFnCalled = true;
                return Promise.resolve();
            });

            objectInstance.state.crud.retrieve = vi.fn().mockReturnValueOnce(testPromise);

            const result = objectInstance.retrieve();
            expect(isRef(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(false);

            await result.cancel();

            expect(cancelFnCalled).toBe(true);
            expect(unref(objectInstance.state.crud.retrieve.mock.calls[0][0].isCancelled)).toBe(true);
        });
    });
    describe("create", function () {
        it("success", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            let crudCreateResolve;
            const crudCreatePromise = new Promise((resolve) => {
                crudCreateResolve = resolve;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiCreateResolve = objectInstance.create({
                object: {
                    name: "qwer",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudCreateResolve is set in the promise, so it will be defined
            crudCreateResolve(crudCreateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudCreateResolved);
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                pkKey: "id",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);
            await nextTick();
            await expect(oiCreateResolve).resolves.toBe(true);
        });
        it("success (params)", async function () {
            const id = ref(undefined);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            let crudCreateResolve;
            const crudCreatePromise = new Promise((resolve) => {
                crudCreateResolve = resolve;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiCreateResolve = objectInstance.create({
                object: {
                    name: "qwer",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudCreateResolve is set in the promise, so it will be defined
            crudCreateResolve(crudCreateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudCreateResolved);
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    name: "qwer",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(true);
        });
        it("success with non-standard pk", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "unique",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            let crudCreateResolve;
            const crudCreatePromise = new Promise((resolve) => {
                crudCreateResolve = resolve;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiCreateResolve = objectInstance.create({
                object: {
                    name: "qwer",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudCreateResolve is set in the promise, so it will be defined
            crudCreateResolve(crudCreateResolvedNonStandardPK);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudCreateResolvedNonStandardPK);
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                pkKey: "unique",
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);
            await nextTick();
            await expect(oiCreateResolve).resolves.toBe(true);
        });
        it("errored", async function () {
            const id = ref(undefined);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            let crudCreateReject;
            const crudCreatePromise = new Promise((resolve, reject) => {
                crudCreateReject = reject;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiCreateResolve = objectInstance.create({
                object: {
                    name: "qwer",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudCreateReject is set in the promise, so it will be defined
            crudCreateReject(crudCreateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudCreateRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    name: "qwer",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(false);
        });
        it("errored with non-matching pkKey", async function () {
            const id = ref(undefined);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "pk",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            let crudCreateReject;
            const crudCreatePromise = new Promise((resolve, reject) => {
                crudCreateReject = reject;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiCreateResolve = objectInstance.create({
                object: {
                    name: "qwer",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudCreateReject is set in the promise, so it will be defined
            crudCreateReject(crudCreateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudCreateRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "pk",
                object: {
                    name: "qwer",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            objectInstance.state.crud.create = vi.fn();
            const crudCreatePromise = new Promise(() => {});
            objectInstance.state.crud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.create({
                object: {
                    name: "qwer",
                },
            });
            expect(() =>
                objectInstance.create({
                    object: {
                        name: "qwer",
                    },
                })
            ).toThrow(new ObjectError("already loading.", "already-loading"));
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    name: "qwer",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
        it("cancel", async () => {
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: { fields },
                },
            });

            let cancelFnCalled = false;
            const testPromise = CancellablePromise(new Promise(() => {}), () => {
                cancelFnCalled = true;
                return Promise.resolve();
            });

            objectInstance.state.crud.create = vi.fn().mockReturnValueOnce(testPromise);

            const result = objectInstance.create({
                dummy: "object",
            });
            expect(isRef(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(false);

            await result.cancel();

            expect(cancelFnCalled).toBe(true);
            expect(unref(objectInstance.state.crud.create.mock.calls[0][0].isCancelled)).toBe(true);
        });
    });
    describe("update", function () {
        it("success", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            let crudUpdateResolve;
            const crudUpdatePromise = new Promise((resolve) => {
                crudUpdateResolve = resolve;
            });
            objectInstance.state.crud.update = vi.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudUpdateResolve is set in the promise, so it will be defined
            crudUpdateResolve(crudUpdateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudUpdateResolved);
            await nextTick();
            await expect(oiUpdatePromise).resolves.toBe(true);
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("success (params)", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            let crudUpdateResolve;
            const crudUpdatePromise = new Promise((resolve) => {
                crudUpdateResolve = resolve;
            });
            objectInstance.state.crud.update = vi.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudUpdateResolve is set in the promise, so it will be defined
            crudUpdateResolve(crudUpdateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudUpdateResolved);
            await expect(oiUpdatePromise).resolves.toBe(true);
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("success with non-standard pk", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "unique",
                    params,
                },
            });
            let crudUpdateResolve;
            const crudUpdatePromise = new Promise((resolve) => {
                crudUpdateResolve = resolve;
            });
            objectInstance.state.crud.update = vi.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    unique: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudUpdateResolve is set in the promise, so it will be defined
            crudUpdateResolve(crudUpdateResolvedWithNonStandardPk);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudUpdateResolvedWithNonStandardPk);
            await expect(oiUpdatePromise).resolves.toBe(true);
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "unique",
                object: {
                    unique: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("errored", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            let crudUpdateReject;
            const crudUpdatePromise = new Promise((resolve, reject) => {
                crudUpdateReject = reject;
            });
            objectInstance.state.crud.update = vi.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudUpdateReject is set in the promise, so it will be defined
            crudUpdateReject(crudUpdateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudUpdateRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            await expect(oiUpdatePromise).resolves.toBe(false);
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("errored with non-matching pkKey", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            let crudUpdateReject;
            const crudUpdatePromise = new Promise((resolve, reject) => {
                crudUpdateReject = reject;
            });
            objectInstance.state.crud.update = vi.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudUpdateReject is set in the promise, so it will be defined
            crudUpdateReject(crudUpdateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudUpdateRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            await expect(oiUpdatePromise).resolves.toBe(false);
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("already loading", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            const crudUpdatePromise = new Promise(() => {});
            objectInstance.state.crud.update = vi.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expect(() =>
                objectInstance.update({
                    object: {
                        id: 1,
                        name: "zxcv!",
                    },
                })
            ).toThrow(new ObjectError("already loading.", "already-loading"));
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pkKey: "id",
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("cancel", async () => {
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: { fields },
                },
            });

            let cancelFnCalled = false;
            const testPromise = CancellablePromise(new Promise(() => {}), () => {
                cancelFnCalled = true;
                return Promise.resolve();
            });

            objectInstance.state.crud.update = vi.fn().mockReturnValueOnce(testPromise);

            const result = objectInstance.update({
                id: 1,
                dummy: "object",
            });
            expect(isRef(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(false);

            await result.cancel();

            expect(cancelFnCalled).toBe(true);
            expect(unref(objectInstance.state.crud.update.mock.calls[0][0].isCancelled)).toBe(true);
        });
    });
    describe("patch", function () {
        it("success", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            let crudPatchResolve;
            const crudPatchPromise = new Promise((resolve) => {
                crudPatchResolve = resolve;
            });
            objectInstance.state.crud.patch = vi.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudPatchResolve is set in the promise, so it will be defined
            crudPatchResolve(crudPatchResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudPatchResolved);
            await nextTick();
            await expect(oiPatchPromise).resolves.toBe(true);
            expect(objectInstance.state.crud.patch).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pk: 1,
                pkKey: "id",
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("success with non-standard pk", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "unique",
                    params,
                },
            });
            let crudPatchResolve;
            const crudPatchPromise = new Promise((resolve) => {
                crudPatchResolve = resolve;
            });
            objectInstance.state.crud.patch = vi.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                partialObject: {
                    unique: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            // @ts-ignore - crudPatchResolve is set in the promise, so it will be defined
            crudPatchResolve(crudPatchResolvedWithNonStandardPk);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudPatchResolvedWithNonStandardPk);
            await nextTick();
            await expect(oiPatchPromise).resolves.toBe(true);
            expect(objectInstance.state.crud.patch).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pk: 1,
                pkKey: "unique",
                partialObject: {
                    unique: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("errored", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    params,
                },
            });
            let crudPatchReject;
            const crudPatchPromise = new Promise((resolve, reject) => {
                crudPatchReject = reject;
            });
            objectInstance.state.crud.patch = vi.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudPatchReject is set in the promise, so it will be defined
            crudPatchReject(crudPatchRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudPatchRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            await expect(oiPatchPromise).resolves.toBe(false);
            expect(objectInstance.state.crud.patch).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pk: 1,
                pkKey: "id",
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("errored with non-matching pkKey", async function () {
            const id = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: id,
                    pkKey: "pk",
                    params,
                },
            });
            let crudPatchReject;
            const crudPatchPromise = new Promise((resolve, reject) => {
                crudPatchReject = reject;
            });
            objectInstance.state.crud.patch = vi.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            // @ts-ignore - crudPatchReject is set in the promise, so it will be defined
            crudPatchReject(crudPatchRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudPatchRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            await expect(oiPatchPromise).resolves.toBe(false);
            expect(objectInstance.state.crud.patch).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pk: 1,
                pkKey: "pk",
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("already loading", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            const crudPatchPromise = new Promise(() => {});
            objectInstance.state.crud.patch = vi.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
            objectInstance.patch({
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expect(() =>
                objectInstance.patch({
                    partialObject: {
                        id: 1,
                        name: "zxcv!",
                    },
                })
            ).toThrow(new ObjectError("already loading.", "already-loading"));
            expect(objectInstance.state.crud.patch).toHaveBeenCalledWith({
                target: {
                    stream: "test_stream",
                },
                pk: 1,
                pkKey: "id",
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                params: { fields: ["id", "__str__", "name"] },
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("cancel", async () => {
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: { fields },
                },
            });

            let cancelFnCalled = false;
            const testPromise = CancellablePromise(new Promise(() => {}), () => {
                cancelFnCalled = true;
                return Promise.resolve();
            });

            objectInstance.state.crud.patch = vi.fn().mockReturnValueOnce(testPromise);

            const result = objectInstance.patch({
                id: 1,
                dummy: "object",
            });
            expect(isRef(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(false);

            await result.cancel();

            expect(cancelFnCalled).toBe(true);
            expect(unref(objectInstance.state.crud.patch.mock.calls[0][0].isCancelled)).toBe(true);
        });
    });
    describe("delete", function () {
        it("success", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "unique",
                    params,
                },
            });
            assignReactiveObject(objectInstance.state.object, crudRetrieveResolvedNonStandardPrimaryKey);
            let deleteResolve;
            const deletePromise = new Promise((resolve) => {
                deleteResolve = resolve;
            });
            objectInstance.state.crud.delete = vi.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolvedNonStandardPrimaryKey);

            const returnsPromise = objectInstance.delete();

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolvedNonStandardPrimaryKey);
            await nextTick();

            // @ts-ignore - deleteResolve is set in the promise, so it will be defined
            deleteResolve(crudDeleteResolved);
            await flushPromises();

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect(objectInstance.state.deleted).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();

            await expect(returnsPromise).resolves.toBe(true);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "unique",
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("errored", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            assignReactiveObject(objectInstance.state.object, crudRetrieveResolved);
            let deleteReject;
            const deletePromise = new Promise((resolve, reject) => {
                deleteReject = reject;
            });
            objectInstance.state.crud.delete = vi.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);

            const returnsPromise = objectInstance.delete();

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            // @ts-ignore - deleteReject is set in the promise, so it will be defined
            deleteReject(crudDeleteRejected);
            await flushPromises();

            expect(objectInstance.state.error).toEqual(crudDeleteRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            await expect(returnsPromise).resolves.toBe(false);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("errored with non-matching pkKey", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "unique",
                    params,
                },
            });
            assignReactiveObject(objectInstance.state.object, crudRetrieveResolved);
            let deleteReject;
            const deletePromise = new Promise((resolve, reject) => {
                deleteReject = reject;
            });
            objectInstance.state.crud.delete = vi.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);

            const returnsPromise = objectInstance.delete();

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            // @ts-ignore - deleteReject is set in the promise, so it will be defined
            deleteReject(crudDeleteRejected);
            await flushPromises();

            expect(objectInstance.state.error).toEqual(crudDeleteRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            await expect(returnsPromise).resolves.toBe(false);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "unique",
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("already loading", async function () {
            const pk = ref(1);
            const params = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk,
                    pkKey: "id",
                    params,
                },
            });
            const deletePromise = new Promise(() => {});
            objectInstance.state.crud.delete = vi.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);
            objectInstance.delete(1);
            expect(() => objectInstance.delete()).toThrow(new ObjectError("already loading.", "already-loading"));
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(false);
        });
        it("cancel", async () => {
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: { fields },
                },
            });

            let cancelFnCalled = false;
            const testPromise = CancellablePromise(new Promise(() => {}), () => {
                cancelFnCalled = true;
                return Promise.resolve();
            });

            objectInstance.state.crud.delete = vi.fn().mockReturnValueOnce(testPromise);

            const result = objectInstance.delete();
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                target: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                isCancelled: expect.any(Object),
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
            expect(isRef(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(true);
            expect(unref(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(false);

            await result.cancel();

            expect(cancelFnCalled).toBe(true);
            expect(unref(objectInstance.state.crud.delete.mock.calls[0][0].isCancelled)).toBe(true);
        });
    });
    describe("clear", () => {
        it("resets object and error state", async () => {
            const objectInstance = useObjectInstance({
                props: {
                    target: { stream: "test_stream" },
                    pk: 1,
                    pkKey: "id",
                    params: { fields },
                },
            });

            assignReactiveObject(objectInstance.state.object, crudRetrieveResolved);
            // objectInstance.state.error = ref(new Error("Test"));
            // objectInstance.state.errored = ref(true);
            currentSetError(new Error("Test"));

            objectInstance.clear();

            expect(objectInstance.state.object).toEqual({});
            expect(objectInstance.state.error).toBeNull();
            expect(objectInstance.state.errored).toBe(false);
        });
    });
    it("useObjectSubscriptions", async function () {
        const objectInstanceA = useObjectInstance({
            props: {
                target: { stream: "test_streamA" },
                pk: 1,
                pkKey: "id",
                params: {
                    fields,
                },
            },
        });
        const objectInstanceB = useObjectInstance({
            props: {
                target: { stream: "test_streamB" },
                pk: 2,
                pkKey: "id",
                params: {
                    fields,
                },
            },
        });
        const objInstances = useObjectInstances({
            A: {
                props: {
                    target: { stream: "test_streamA" },
                    pk: 1,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                },
            },
            B: {
                props: {
                    target: { stream: "test_streamB" },
                    pk: 2,
                    pkKey: "id",
                    params: {
                        fields,
                    },
                },
            },
        });
        expect(deepUnref(objInstances.A.state)).toEqual(deepUnref(objectInstanceA.state));
        expect(deepUnref(objInstances.B.state)).toEqual(deepUnref(objectInstanceB.state));
    });
    it("useObjectInstance missing pkKey", async function () {
        const objectInstanceProps = {
            target: { stream: "test_streamA" },
            pk: 1,
            params: {
                fields,
            },
        };
        expect(() => useObjectInstance({ props: objectInstanceProps })).toThrow(ObjectError);
    });
});
