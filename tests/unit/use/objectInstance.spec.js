import flushPromises from "flush-promises";
import { nextTick } from "vue";
import { assignReactiveObject } from "../../../utils";
import { expectErrorToBeNull } from "../expectHelpers";
import { inspect } from "util";

afterAll(() => {
    jest.restoreAllMocks();
});

describe("use/objectInstance.js", function () {
    let useObjectInstance, ObjectError, useObjectInstances;
    beforeAll(async () => {
        const imported = await import("../../../use/objectInstance");
        useObjectInstance = imported.useObjectInstance;
        ObjectError = imported.ObjectError;
        useObjectInstances = imported.useObjectInstances;
    });
    afterEach(function () {
        jest.resetAllMocks();
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.objectInstanceCrud.retrieve = jest.fn();
            let crudRetrieveResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.retrieve.mockReturnValueOnce(crudRetrievePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve({ id: 1, fields });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            crudRetrieveResolve(crudRetrieveResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledTimes(1);
            await nextTick();
            await expect(oiRetrieveResolve).resolves.toBe(true);
        });
        it("success (defaultRetrieveArgs)", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
                retrieveArgs: { fields },
            });
            objectInstance.state.objectInstanceCrud.retrieve = jest.fn();
            let crudRetrieveResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.retrieve.mockReturnValueOnce(crudRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve({ id: 1 });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            crudRetrieveResolve(crudRetrieveResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(true);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.objectInstanceCrud.retrieve = jest.fn();
            let crudRetrieveReject;
            const crudRetrievePromise = new Promise((resolve, reject) => {
                crudRetrieveReject = reject;
            });
            objectInstance.state.objectInstanceCrud.retrieve.mockReturnValueOnce(crudRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve({ id: 1, fields });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            crudRetrieveReject(crudRetrieveRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudRetrieveRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.objectInstanceCrud.retrieve = jest.fn();
            objectInstance.state.objectInstanceCrud.retrieve.mockImplementation(() => new Promise(() => {}));
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.retrieve({ id: 1, fields });
            await expect(() => objectInstance.retrieve({ id: 1, fields })).rejects.toThrow(ObjectError);
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.retrieve).toHaveBeenCalledTimes(1);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
    });
    describe("create", function () {
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.objectInstanceCrud.create = jest.fn();
            let crudCreateResolve;
            const crudCreatePromise = new Promise((resolve) => {
                crudCreateResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.create.mockReturnValueOnce(crudCreatePromise);
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
            crudCreateResolve(crudCreateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudCreateResolved);
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledTimes(1);
            await nextTick();
            await expect(oiCreateResolve).resolves.toBe(true);
        });
        it("success (defaultRetrieveArgs)", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
                retrieveArgs: { fields },
            });
            objectInstance.state.objectInstanceCrud.create = jest.fn();
            let crudCreateResolve;
            const crudCreatePromise = new Promise((resolve) => {
                crudCreateResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.create.mockReturnValueOnce(crudCreatePromise);
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
            crudCreateResolve(crudCreateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudCreateResolved);
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledTimes(1);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(true);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.objectInstanceCrud.create = jest.fn();
            let crudCreateReject;
            const crudCreatePromise = new Promise((resolve, reject) => {
                crudCreateReject = reject;
            });
            objectInstance.state.objectInstanceCrud.create.mockReturnValueOnce(crudCreatePromise);
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
            crudCreateReject(crudCreateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudCreateRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledTimes(1);
            const returnValue = await oiCreateResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.objectInstanceCrud.create = jest.fn();
            const crudCreatePromise = new Promise(() => {});
            objectInstance.state.objectInstanceCrud.create.mockReturnValueOnce(crudCreatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.create({
                object: {
                    name: "qwer",
                },
                fields,
            });
            await expect(() =>
                objectInstance.create({
                    object: {
                        name: "qwer",
                    },
                    fields,
                })
            ).rejects.toThrow(ObjectError);
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    name: "qwer",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.create).toHaveBeenCalledTimes(1);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
        });
    });
    describe("update", function () {
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudUpdateResolve;
            const crudUpdatePromise = new Promise((resolve) => {
                crudUpdateResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.update = jest.fn();
            objectInstance.state.objectInstanceCrud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            crudUpdateResolve(crudUpdateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudUpdateResolved);
            await nextTick();
            await expect(oiUpdatePromise).resolves.toBe(true);
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledTimes(1);
        });
        it("success (defaultRetrieveArgs)", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
                retrieveArgs: { fields },
            });
            let crudUpdateResolve;
            const crudUpdatePromise = new Promise((resolve) => {
                crudUpdateResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.update = jest.fn();
            objectInstance.state.objectInstanceCrud.update.mockReturnValueOnce(crudUpdatePromise);
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
            crudUpdateResolve(crudUpdateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudUpdateResolved);
            await expect(oiUpdatePromise).resolves.toBe(true);
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudUpdateReject;
            const crudUpdatePromise = new Promise((resolve, reject) => {
                crudUpdateReject = reject;
            });
            objectInstance.state.objectInstanceCrud.update = jest.fn();
            objectInstance.state.objectInstanceCrud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiUpdatePromise = objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            crudUpdateReject(crudUpdateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudUpdateRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            await expect(oiUpdatePromise).resolves.toBe(false);
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            const crudUpdatePromise = new Promise(() => {});
            objectInstance.state.objectInstanceCrud.update = jest.fn();
            objectInstance.state.objectInstanceCrud.update.mockReturnValueOnce(crudUpdatePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.update({
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                fields,
            });
            await expect(() =>
                objectInstance.update({
                    object: {
                        id: 1,
                        name: "zxcv!",
                    },
                    fields,
                })
            ).rejects.toThrow(ObjectError);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledWith({
                crudArgs: {
                    stream: "test_stream",
                },
                object: {
                    id: 1,
                    name: "zxcv!",
                },
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.objectInstanceCrud.update).toHaveBeenCalledTimes(1);
        });
    });
    describe("patch", function () {
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudPatchResolve;
            const crudPatchPromise = new Promise((resolve) => {
                crudPatchResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.patch = jest.fn();
            objectInstance.state.objectInstanceCrud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                id: 1,
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();
            crudPatchResolve(crudPatchResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudPatchResolved);
            await nextTick();
            await expect(oiPatchPromise).resolves.toBe(true);
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledWith({
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
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledTimes(1);
        });
        it("success (defaultRetrieveArgs)", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
                retrieveArgs: { fields },
            });
            let crudPatchResolve;
            const crudPatchPromise = new Promise((resolve) => {
                crudPatchResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.patch = jest.fn();
            objectInstance.state.objectInstanceCrud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                id: 1,
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            crudPatchResolve(crudPatchResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudPatchResolved);
            await expect(oiPatchPromise).resolves.toBe(true);
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledWith({
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
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudPatchReject;
            const crudPatchPromise = new Promise((resolve, reject) => {
                crudPatchReject = reject;
            });
            objectInstance.state.objectInstanceCrud.patch = jest.fn();
            objectInstance.state.objectInstanceCrud.patch.mockReturnValueOnce(crudPatchPromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiPatchPromise = objectInstance.patch({
                id: 1,
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                fields,
            });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            crudPatchReject(crudPatchRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(crudPatchRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual({});
            await expect(oiPatchPromise).resolves.toBe(false);
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledWith({
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
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            const crudPatchPromise = new Promise(() => {});
            objectInstance.state.objectInstanceCrud.patch = jest.fn();
            objectInstance.state.objectInstanceCrud.patch.mockReturnValueOnce(crudPatchPromise);
            objectInstance.patch({
                id: 1,
                partialObject: {
                    id: 1,
                    name: "zxcv!",
                },
                fields,
            });
            await expect(() =>
                objectInstance.patch({
                    id: 1,
                    partialObject: {
                        id: 1,
                        name: "zxcv!",
                    },
                    fields,
                })
            ).rejects.toThrow(ObjectError);
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledWith({
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
            expect(objectInstance.state.objectInstanceCrud.patch).toHaveBeenCalledTimes(1);
        });
    });
    describe("delete", function () {
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            assignReactiveObject(objectInstance.state.object, crudRetrieveResolved);
            let deleteResolve;
            const deletePromise = new Promise((resolve) => {
                deleteResolve = resolve;
            });
            objectInstance.state.objectInstanceCrud.delete = jest.fn();
            objectInstance.state.objectInstanceCrud.delete.mockReturnValueOnce(deletePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);

            const returnsPromise = objectInstance.delete(1);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            deleteResolve(crudDeleteResolved);
            await flushPromises();

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect(objectInstance.state.deleted).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            await nextTick();

            await expect(returnsPromise).resolves.toBe(true);
            expect(objectInstance.state.objectInstanceCrud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.objectInstanceCrud.delete).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            assignReactiveObject(objectInstance.state.object, crudRetrieveResolved);
            let deleteReject;
            const deletePromise = new Promise((resolve, reject) => {
                deleteReject = reject;
            });
            objectInstance.state.objectInstanceCrud.delete = jest.fn();
            objectInstance.state.objectInstanceCrud.delete.mockReturnValueOnce(deletePromise);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);

            const returnsPromise = objectInstance.delete(1);

            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            deleteReject(crudDeleteRejected);
            await flushPromises();

            expect(objectInstance.state.error).toEqual(crudDeleteRejected);
            expect(objectInstance.state.errored).toBe(true);
            expect(objectInstance.state.loading).toBe(false);
            expect(objectInstance.state.deleted).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudRetrieveResolved);
            await nextTick();

            await expect(returnsPromise).resolves.toBe(false);
            expect(objectInstance.state.objectInstanceCrud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.objectInstanceCrud.delete).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            const deletePromise = new Promise(() => {});
            objectInstance.state.objectInstanceCrud.delete = jest.fn();
            objectInstance.state.objectInstanceCrud.delete.mockReturnValueOnce(deletePromise);
            objectInstance.delete(1);
            await expect(() => objectInstance.delete(1)).rejects.toThrow(ObjectError);
            expect(objectInstance.state.objectInstanceCrud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.objectInstanceCrud.delete).toHaveBeenCalledTimes(1);
        });
    });
    it("useObjectSubscriptions", async function () {
        const objectInstanceA = useObjectInstance({
            crudArgs: { stream: "test_streamA" },
            id: 1,
            retrieveArgs: {
                fields,
            },
        });
        const objectInstanceB = useObjectInstance({
            crudArgs: { stream: "test_streamB" },
            id: 2,
            retrieveArgs: {
                fields,
            },
        });
        const objInstances = useObjectInstances({
            A: {
                crudArgs: { stream: "test_streamA" },
                id: 1,
                retrieveArgs: {
                    fields,
                },
            },
            B: {
                crudArgs: { stream: "test_streamB" },
                id: 2,
                retrieveArgs: {
                    fields,
                },
            },
        });
        expect(inspect(objInstances.A)).toEqual(inspect(objectInstanceA));
        expect(inspect(objInstances.B)).toEqual(inspect(objectInstanceB));
    });
});
