import { assignReactiveObject } from "../../../utils/assignReactiveObject.js";
import { expectErrorToBeNull } from "../expectHelpers.js";
import flushPromises from "flush-promises";
import { inspect } from "util";
import { nextTick, reactive, ref } from "vue";

afterAll(() => {
    vi.restoreAllMocks();
});

describe("use/objectInstance.js", function () {
    let useObjectInstance, ObjectError, useObjectInstances;
    beforeAll(async () => {
        const imported = await import("../../../use/objectInstance.js");
        useObjectInstance = imported.useObjectInstance;
        ObjectError = imported.ObjectError;
        useObjectInstances = imported.useObjectInstances;
    });
    afterEach(function () {
        vi.resetAllMocks();
    });
    const crudRetrieveResolved = {
        id: 1,
        __str__: "asdf",
        name: "zxcv",
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
        __str__: "qwer",
        name: "qwer",
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
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            await nextTick();
            await expect(oiRetrieveResolve).resolves.toBe(true);
        });
        it("success (retrieveArgs)", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
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
                crudArgs: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(true);
        });
        it("errored", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
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
                crudArgs: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
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
            await expect(() => objectInstance.retrieve()).rejects.toThrow(ObjectError);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(0);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
        it("double retrieve gets the same promise", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
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
            // await expect(() => objectInstance.retrieve()).rejects.toThrow(ObjectError);
            expect(firstPromise).toBe(secondPromise);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                pk: 1,
                pkKey: "id",
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
    });
    describe("create", function () {
        it("success", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            await nextTick();
            await expect(oiCreateResolve).resolves.toBe(true);
        });
        it("success (retrieveArgs)", async function () {
            const id = ref(undefined);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(true);
        });
        it("errored", async function () {
            const id = ref(undefined);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
            await expect(() =>
                objectInstance.create({
                    object: {
                        name: "qwer",
                    },
                })
            ).rejects.toThrow(ObjectError);
            expect(objectInstance.state.crud.create).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.create).toHaveBeenCalledTimes(1);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
    });
    describe("update", function () {
        it("success", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
        });
        it("success (retrieveArgs)", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
            await expect(() =>
                objectInstance.update({
                    object: {
                        id: 1,
                        name: "zxcv!",
                    },
                })
            ).rejects.toThrow(ObjectError);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.crud.update).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.update).toHaveBeenCalledTimes(1);
        });
    });
    describe("patch", function () {
        it("success", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                id: 1,
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
                crudArgs: {
                    stream: "test_stream",
                },
                id: 1,
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    pk: id,
                    pkKey: "id",
                    retrieveArgs,
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
            await expect(() =>
                objectInstance.patch({
                    partialObject: {
                        id: 1,
                        name: "zxcv!",
                    },
                })
            ).rejects.toThrow(ObjectError);
            expect(objectInstance.state.crud.patch).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                pk: 1,
                pkKey: "id",
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.patch).toHaveBeenCalledTimes(1);
        });
    });
    describe("delete", function () {
        it("success", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
                },
            });
            assignReactiveObject(objectInstance.state.object, crudRetrieveResolved);
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
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);

            const returnsPromise = objectInstance.delete();

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
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
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
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
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const id = ref(1);
            const retrieveArgs = reactive({ fields });
            const objectInstance = useObjectInstance({
                props: {
                    crudArgs: { stream: "test_stream" },
                    id,
                    retrieveArgs,
                },
            });
            const deletePromise = new Promise(() => {});
            objectInstance.state.crud.delete = vi.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);
            objectInstance.delete(1);
            await expect(() => objectInstance.delete()).rejects.toThrow(ObjectError);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
        });
    });
    it("useObjectSubscriptions", async function () {
        const objectInstanceA = useObjectInstance({
            props: {
                crudArgs: { stream: "test_streamA" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            },
        });
        const objectInstanceB = useObjectInstance({
            props: {
                crudArgs: { stream: "test_streamB" },
                id: 2,
                retrieveArgs: {
                    fields,
                },
            },
        });
        const objInstances = useObjectInstances({
            A: {
                props: {
                    crudArgs: { stream: "test_streamA" },
                    id: 1,
                    retrieveArgs: {
                        fields,
                    },
                },
            },
            B: {
                props: {
                    crudArgs: { stream: "test_streamB" },
                    id: 2,
                    retrieveArgs: {
                        fields,
                    },
                },
            },
        });
        expect(inspect(objInstances.A)).toEqual(inspect(objectInstanceA));
        expect(inspect(objInstances.B)).toEqual(inspect(objectInstanceB));
    });
});
