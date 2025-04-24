import cloneDeep from "lodash-es/cloneDeep.js";
import { reactive } from "vue";

describe("config/objectCrud.js", () => {
    describe("get & set", () => {
        let setObjectCrud, getObjectCrud;
        beforeAll(async () => {
            const objectCrudModule = await import("../../../config/objectCrud.js");
            setObjectCrud = objectCrudModule.setObjectCrud;
            getObjectCrud = objectCrudModule.getObjectCrud;
        });
        it("should not die getting crud before setting", () => {
            const reactiveCrud = reactive({});
            expect(() => getObjectCrud(reactiveCrud)).not.toThrow();
        });
        it("should set and get the default crud, avoiding mutation", () => {
            const crud = {
                retrieve: () => 1,
                create: () => 2,
                update: () => 3,
                patch: () => 4,
                delete: () => 5,
                subscribe: () => 6,
                args: {
                    test: "test",
                },
            };
            expect(() => setObjectCrud(crud)).not.toThrow();

            /** @type {import("vue").UnwrapNestedRefs<
             *      import('../../../config/objectCrud.js').ObjectCrudHandlers &
             *      import('../../../config/objectCrud.js').ObjectTarget
             *  >}
             */
            const retrievedCrud = reactive({
                args: {},
            });
            expect(() => getObjectCrud(retrievedCrud)).not.toThrow();
            expect(new Set(Object.keys(retrievedCrud))).toEqual(
                new Set(["retrieve", "create", "update", "patch", "delete", "subscribe", "args"])
            );
            expect(retrievedCrud.args).not.toBe(crud.args);
            expect(retrievedCrud.args).toEqual(crud.args);
            expect(retrievedCrud.retrieve).toBe(crud.retrieve);
            expect(retrievedCrud.create).toBe(crud.create);
            expect(retrievedCrud.update).toBe(crud.update);
            expect(retrievedCrud.patch).toBe(crud.patch);
            expect(retrievedCrud.delete).toBe(crud.delete);
            expect(retrievedCrud.subscribe).toBe(crud.subscribe);

            const originalCrud = cloneDeep(crud);
            crud.args.test = "test2";
            crud.retrieve = () => 7;
            crud.create = () => 8;
            crud.update = () => 9;
            crud.patch = () => 10;
            crud.delete = () => 11;
            crud.subscribe = () => 12;
            expect(retrievedCrud.args.test).toBe(originalCrud.args.test);
            expect(retrievedCrud.retrieve).toBe(originalCrud.retrieve);
            expect(retrievedCrud.create).toBe(originalCrud.create);
            expect(retrievedCrud.update).toBe(originalCrud.update);
            expect(retrievedCrud.patch).toBe(originalCrud.patch);
            expect(retrievedCrud.delete).toBe(originalCrud.delete);
            expect(retrievedCrud.subscribe).toBe(originalCrud.subscribe);
        });
        it("should customize via getObjectCrud", () => {
            const defaultCrud = {
                retrieve: () => 1,
                create: () => 2,
                update: () => 3,
                patch: () => 4,
                delete: () => 5,
                subscribe: () => 6,
                args: {
                    test: "test",
                },
            };
            const customTarget = {
                props: reactive({
                    target: {
                        test: "test2",
                    },
                }),
                handlers: {
                    retrieve: () => 7,
                    create: () => 8,
                    update: () => 9,
                    patch: () => 10,
                    delete: () => 11,
                    subscribe: () => 12,
                },
            };
            const expectedCustomCrud = {
                retrieve: customTarget.handlers.retrieve,
                create: customTarget.handlers.create,
                update: customTarget.handlers.update,
                patch: customTarget.handlers.patch,
                delete: customTarget.handlers.delete,
                subscribe: customTarget.handlers.subscribe,
                args: customTarget.props.target,
            };
            expect(() => setObjectCrud(defaultCrud)).not.toThrow();
            const defaultRetrievedCrud = reactive({});
            getObjectCrud(defaultRetrievedCrud);
            expect(defaultRetrievedCrud).toEqual(defaultCrud);
            expect(defaultRetrievedCrud).not.toEqual(expectedCustomCrud);
            const customRetrievedCrud = reactive({});
            getObjectCrud(customRetrievedCrud, customTarget);
            expect(customRetrievedCrud).toEqual(expectedCustomCrud);
            expect(customRetrievedCrud).not.toEqual(defaultCrud);
            expect(defaultRetrievedCrud).toEqual(defaultCrud);
            expect(defaultRetrievedCrud).not.toEqual(expectedCustomCrud);
        });
        it("should die if an unknown function is passed", () => {
            expect(() =>
                setObjectCrud({
                    retrieve: () => 1,
                    create: () => 2,
                    update: () => 3,
                    patch: () => 4,
                    delete: () => 5,
                    subscribe: () => 6,
                    args: { test: "test" },
                    unknown: () => 7,
                })
            ).toThrow('Unknown key "unknown" passed to setObjectCrud');
        });

        it("should throw if passed handlers object that has values that are not handlers", () => {
            const retrievedCrud = reactive({});
            expect(() =>
                getObjectCrud(retrievedCrud, {
                    handlers: {
                        retrieve: () => 1,
                        create: () => 2,
                        update: 3,
                        patch: () => 4,
                        delete: () => 5,
                        subscribe: () => 6,
                    },
                })
            ).toThrow('Function "update" is not actually a function');
        });
        it("should throw if passed unexpected handlers", () => {
            const retrievedCrud = reactive({});
            expect(() =>
                getObjectCrud(retrievedCrud, {
                    handlers: {
                        retrieve: () => 1,
                        create: () => 2,
                        update: () => 3,
                        patch: () => 4,
                        delete: () => 5,
                        subscribe: () => 6,
                        unknown: () => 7,
                    },
                })
            ).toThrow('Invalid function key "unknown" passed to assignCrud');
        });
    });
});
