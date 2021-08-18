import flushPromises from "flush-promises";
import { expectErrorToBeNull } from "../expectHelpers";

afterAll(() => {
    jest.restoreAllMocks();
});

describe("use/objectInstance.js", function () {
    let useObjectInstance, ObjectError;
    beforeAll(async () => {
        const imported = await import("../../../use/objectInstance");
        useObjectInstance = imported.default;
        ObjectError = imported.ObjectError;
    });
    afterEach(function () {
        jest.resetAllMocks();
    });
    describe("retrieve", function () {
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
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.retrieve = jest.fn();
            let crudRetrieveResolve;
            const crudRetrievePromise = new Promise((resolve) => {
                crudRetrieveResolve = resolve;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve({ id: 1, fields });
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
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(true);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.retrieve = jest.fn();
            let crudRetrieveReject;
            const crudRetrievePromise = new Promise((resolve, reject) => {
                crudRetrieveReject = reject;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(crudRetrievePromise);
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
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
                retrieveArgs: { fields: ["id", "__str__", "name"] },
            });
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledTimes(1);
            const returnValue = await oiRetrieveResolve;
            expect(returnValue).toBe(false);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.retrieve = jest.fn();
            objectInstance.state.crud.retrieve.mockImplementation(() => new Promise(() => {}));
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            objectInstance.retrieve({ id: 1, fields });
            await expect(() => objectInstance.retrieve({ id: 1, fields })).rejects.toThrow(ObjectError);
            expect(objectInstance.state.crud.retrieve).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
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
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.create = jest.fn();
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.create = jest.fn();
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.create = jest.fn();
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
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudUpdateResolve;
            const crudUpdatePromise = new Promise((resolve) => {
                crudUpdateResolve = resolve;
            });
            objectInstance.state.crud.update = jest.fn();
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
                fields,
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudUpdateReject;
            const crudUpdatePromise = new Promise((resolve, reject) => {
                crudUpdateReject = reject;
            });
            objectInstance.state.crud.update = jest.fn();
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            const crudUpdatePromise = new Promise(() => {});
            objectInstance.state.crud.update = jest.fn();
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
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudPatchResolve;
            const crudPatchPromise = new Promise((resolve) => {
                crudPatchResolve = resolve;
            });
            objectInstance.state.crud.patch = jest.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
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
            crudPatchResolve(crudPatchResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(crudPatchResolved);
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let crudPatchReject;
            const crudPatchPromise = new Promise((resolve, reject) => {
                crudPatchReject = reject;
            });
            objectInstance.state.crud.patch = jest.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
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
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            const crudPatchPromise = new Promise(() => {});
            objectInstance.state.crud.patch = jest.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(crudPatchPromise);
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
    });
    describe("delete", function () {
        const deleteResolved = {
            errors: [],
            data: null,
            action: "delete",
            response_status: 204,
            request_id: "454619de-6687-4664-ad2a-67cdb393eb70",
        };
        const deleteRejected = {
            errors: ["You cannot delete this object at this time."],
            data: null,
            action: "delete",
            response_status: 400,
            request_id: "454619de-6687-4664-ad2a-67cdb393eb70",
        };
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let deleteResolve;
            const deletePromise = new Promise((resolve) => {
                deleteResolve = resolve;
            });
            objectInstance.state.crud.delete = jest.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);
            const returnsPromise = objectInstance.delete(1);
            deleteResolve(deleteResolved);
            await expect(returnsPromise).resolves.toBe(true);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
        });
        it("errored", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let deleteReject;
            const deletePromise = new Promise((resolve, reject) => {
                deleteReject = reject;
            });
            objectInstance.state.crud.delete = jest.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);
            const returnsPromise = objectInstance.delete(1);
            deleteReject(deleteRejected);
            await expect(returnsPromise).resolves.toBe(false);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
        });
        it("already loading", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            const deletePromise = new Promise(() => {});
            objectInstance.state.crud.delete = jest.fn();
            objectInstance.state.crud.delete.mockReturnValueOnce(deletePromise);
            objectInstance.delete(1);
            await expect(() => objectInstance.delete(1)).rejects.toThrow(ObjectError);
            expect(objectInstance.state.crud.delete).toHaveBeenCalledWith({
                crudArgs: { stream: "test_stream" },
                id: 1,
            });
            expect(objectInstance.state.crud.delete).toHaveBeenCalledTimes(1);
        });
    });
    it("updateFromSubscription", function () {
        const objectInstance = useObjectInstance({
            stream: "test_stream",
        });
        objectInstance.updateFromSubscription({ name: "asdf" });
        expect({ ...objectInstance.state.object }).toEqual({ name: "asdf" });
        objectInstance.updateFromSubscription({ __str__: "zxcv" });
        expect({ ...objectInstance.state.object }).toEqual({ __str__: "zxcv" });
    });
});
