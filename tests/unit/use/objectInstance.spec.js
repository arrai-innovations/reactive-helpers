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
        const dcrfRetrieveResolved = {
            id: 1,
            __str__: "asdf",
            name: "zxcv",
        };
        const dcrfRetrieveRejected = {
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
            let dcrfRetrieveResolve;
            const dcrfRetrievePromise = new Promise((resolve) => {
                dcrfRetrieveResolve = resolve;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(dcrfRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve({ id: 1, fields });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            dcrfRetrieveResolve(dcrfRetrieveResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(dcrfRetrieveResolved);
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
            let dcrfRetrieveReject;
            const dcrfRetrievePromise = new Promise((resolve, reject) => {
                dcrfRetrieveReject = reject;
            });
            objectInstance.state.crud.retrieve.mockReturnValueOnce(dcrfRetrievePromise);
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBeUndefined();
            expect({ ...objectInstance.state.object }).toEqual({});
            const oiRetrieveResolve = objectInstance.retrieve({ id: 1, fields });
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(true);
            expect({ ...objectInstance.state.object }).toEqual({});
            dcrfRetrieveReject(dcrfRetrieveRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(dcrfRetrieveRejected);
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
            await expect(() => objectInstance.retrieve({ id: 1, fields })).rejects.toThrow(
                ObjectError,
                "already loading."
            );
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
        const dcrfCreateResolved = {
            id: 1,
            __str__: "qwer",
            name: "qwer",
        };
        const dcrfCreateRejected = { name: ["Test object with this name already exists."] };
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            objectInstance.state.crud.create = jest.fn();
            let dcrfCreateResolve;
            const dcrfCreatePromise = new Promise((resolve) => {
                dcrfCreateResolve = resolve;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(dcrfCreatePromise);
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
            dcrfCreateResolve(dcrfCreateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(dcrfCreateResolved);
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
            let dcrfCreateReject;
            const dcrfCreatePromise = new Promise((resolve, reject) => {
                dcrfCreateReject = reject;
            });
            objectInstance.state.crud.create.mockReturnValueOnce(dcrfCreatePromise);
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
            dcrfCreateReject(dcrfCreateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(dcrfCreateRejected);
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
            const dcrfCreatePromise = new Promise(() => {});
            objectInstance.state.crud.create.mockReturnValueOnce(dcrfCreatePromise);
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
            ).rejects.toThrow(ObjectError, "already loading.");
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
        const dcrfUpdateResolved = {
            id: 1,
            __str__: "asdf!",
            name: "zxcv!",
        };
        const dcrfUpdateRejected = {
            name: ["Test object with this name already exists."],
        };
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let dcrfUpdateResolve;
            const dcrfUpdatePromise = new Promise((resolve) => {
                dcrfUpdateResolve = resolve;
            });
            objectInstance.state.crud.update = jest.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(dcrfUpdatePromise);
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
            dcrfUpdateResolve(dcrfUpdateResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(dcrfUpdateResolved);
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
            let dcrfUpdateReject;
            const dcrfUpdatePromise = new Promise((resolve, reject) => {
                dcrfUpdateReject = reject;
            });
            objectInstance.state.crud.update = jest.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(dcrfUpdatePromise);
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
            dcrfUpdateReject(dcrfUpdateRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(dcrfUpdateRejected);
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
            const dcrfUpdatePromise = new Promise(() => {});
            objectInstance.state.crud.update = jest.fn();
            objectInstance.state.crud.update.mockReturnValueOnce(dcrfUpdatePromise);
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
            ).rejects.toThrow(ObjectError, "already loading.");
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
        const dcrfPatchResolved = {
            id: 1,
            __str__: "asdf!",
            name: "zxcv!",
        };
        const dcrfPatchRejected = {
            name: ["Test object with this name already exists."],
        };
        const fields = ["id", "__str__", "name"];
        it("success", async function () {
            const objectInstance = useObjectInstance({
                crudArgs: { stream: "test_stream" },
            });
            let dcrfPatchResolve;
            const dcrfPatchPromise = new Promise((resolve) => {
                dcrfPatchResolve = resolve;
            });
            objectInstance.state.crud.patch = jest.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(dcrfPatchPromise);
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
            dcrfPatchResolve(dcrfPatchResolved);
            await flushPromises();
            expectErrorToBeNull(objectInstance.state.error);
            expect(objectInstance.state.errored).toBe(false);
            expect(objectInstance.state.loading).toBe(false);
            expect({ ...objectInstance.state.object }).toEqual(dcrfPatchResolved);
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
            let dcrfPatchReject;
            const dcrfPatchPromise = new Promise((resolve, reject) => {
                dcrfPatchReject = reject;
            });
            objectInstance.state.crud.patch = jest.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(dcrfPatchPromise);
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
            dcrfPatchReject(dcrfPatchRejected);
            await flushPromises();
            expect(objectInstance.state.error).toEqual(dcrfPatchRejected);
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
            const dcrfPatchPromise = new Promise(() => {});
            objectInstance.state.crud.patch = jest.fn();
            objectInstance.state.crud.patch.mockReturnValueOnce(dcrfPatchPromise);
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
            ).rejects.toThrow(ObjectError, "already loading.");
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
            errors: [],
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
            await expect(() => objectInstance.delete(1)).rejects.toThrow(ObjectError, "already loading.");
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
