import cloneDeep from "lodash-es/cloneDeep.js";
import { reactive } from "vue";

describe("config/listCrud.js", () => {
    describe("get & set", () => {
        let setListCrud, getListCrud;
        beforeAll(async () => {
            const listCrudModule = await import("../../../config/listCrud.js");
            setListCrud = listCrudModule.setListCrud;
            getListCrud = listCrudModule.getListCrud;
        });
        it("should not die getting crud before setting", () => {
            const reactiveCrud = reactive({});
            expect(() => getListCrud(reactiveCrud)).not.toThrow();
        });
        it("should set and get the default crud, avoiding mutation", () => {
            const crud = {
                list: () => 1,
                subscribe: () => 2,
                args: {
                    test: "test",
                },
            };
            expect(() => setListCrud(crud)).not.toThrow();

            const retrievedCrud = reactive({});
            expect(() => getListCrud(retrievedCrud)).not.toThrow();
            expect(new Set(Object.keys(retrievedCrud))).toEqual(new Set(["list", "subscribe", "args"]));
            expect(retrievedCrud.args).not.toBe(crud.args);
            expect(retrievedCrud.args).toEqual(crud.args);
            expect(retrievedCrud.list).toBe(crud.list);
            expect(retrievedCrud.subscribe).toBe(crud.subscribe);

            const originalCrud = cloneDeep(crud);
            crud.args.test = "test2";
            crud.list = () => 3;
            crud.subscribe = () => 4;
            expect(retrievedCrud.args.test).toBe(originalCrud.args.test);
            expect(retrievedCrud.list).toBe(originalCrud.list);
            expect(retrievedCrud.subscribe).toBe(originalCrud.subscribe);
        });
        it("should die if an unknown function is passed", () => {
            expect(() =>
                setListCrud({ list: () => 1, subscribe: () => 2, args: { test: "test" }, unknown: () => 3 })
            ).toThrow("Unknown key(s) passed to setListCrud: unknown");
        });
        it("should customize via getListCrud", () => {
            const defaultCrud = {
                list: () => 1,
                subscribe: () => 2,
                args: {
                    test: "test",
                },
            };
            const customCrudArgs = {
                props: reactive({
                    crudArgs: {
                        test: "test2",
                    },
                }),
                functions: {
                    list: () => 3,
                    subscribe: () => 4,
                },
            };
            const expectedCustomCrud = {
                list: customCrudArgs.functions.list,
                subscribe: customCrudArgs.functions.subscribe,
                args: customCrudArgs.props.crudArgs,
            };
            expect(() => setListCrud(defaultCrud)).not.toThrow();
            const defaultRetrievedCrud = reactive({});
            getListCrud(defaultRetrievedCrud);
            expect(defaultRetrievedCrud).toEqual(defaultCrud);
            expect(defaultRetrievedCrud).not.toEqual(expectedCustomCrud);
            const customRetrievedCrud = reactive({});
            getListCrud(customRetrievedCrud, customCrudArgs);
            expect(customRetrievedCrud).toEqual(expectedCustomCrud);
            expect(customRetrievedCrud).not.toEqual(defaultCrud);
            expect(defaultRetrievedCrud).toEqual(defaultCrud);
            expect(defaultRetrievedCrud).not.toEqual(expectedCustomCrud);
        });
        it("should throw if passed functions object that has values that are not functions", () => {
            const retrievedCrud = reactive({});
            expect(() =>
                getListCrud(retrievedCrud, {
                    functions: {
                        list: () => 1,
                        subscribe: true,
                    },
                })
            ).toThrow('Invalid function "subscribe" for getListCrud: invalid key or not a function.');
        });
        it("should throw if passed unexpected functions", () => {
            const retrievedCrud = reactive({});
            expect(() =>
                getListCrud(retrievedCrud, {
                    functions: {
                        list: () => 1,
                        subscribe: () => 2,
                        unknown: () => 3,
                    },
                })
            ).toThrow('Invalid function "unknown" for getListCrud: invalid key or not a function.');
        });
    });
});
