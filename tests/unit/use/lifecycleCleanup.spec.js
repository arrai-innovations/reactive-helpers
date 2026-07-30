import { mount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import { KeepAlive, defineComponent, effectScope, h, nextTick, reactive } from "vue";
import { deepUnref } from "../../../utils/deepUnref.js";
import { CancellableResolvable, Resolvable } from "../crudPromise.js";

/**
 * Scope disposal, from the owner's side: what unmounting a component, and stopping a
 * manager, do to the reactive work a composable registered. These are the only tests
 * here that mount a component, because that is the owner the library relies on.
 */
describe("use/lifecycleCleanup.spec.js", function () {
    let useListSubscription, useListSort, useList, crudList, crudListResolvable;

    const settle = async (times = 6) => {
        for (let i = 0; i < times; i++) {
            await nextTick();
            await flushPromises();
        }
    };
    const paramsSeen = () => crudList.mock.calls.map((call) => deepUnref(call[0].params));

    beforeEach(async () => {
        crudListResolvable = [];
        crudList = vi.fn().mockImplementation(() => {
            const next = new CancellableResolvable();
            crudListResolvable.push(next);
            return next.promise;
        });
        useListSubscription = (await import("../../../use/listSubscription.js")).useListSubscription;
        useListSort = (await import("../../../use/listSort.js")).useListSort;
        useList = (await import("../../../use/list.js")).useList;
    });
    afterEach(function () {
        vi.resetAllMocks();
    });

    /**
     * Mount a component whose setup body is `setupFn`, returning the wrapper and whatever
     * setup produced.
     * @param {() => any} setupFn - The setup body to run inside the component's scope.
     * @returns {{ wrapper: import("@vue/test-utils").VueWrapper, created: any }} The mounted wrapper and the setup result.
     */
    const mountWithSetup = (setupFn) => {
        let created;
        const wrapper = mount(
            defineComponent({
                setup() {
                    created = setupFn();
                    return () => h("div");
                },
            })
        );
        return { wrapper, created };
    };

    describe("unmounting the owner", function () {
        it("cancels the in-flight run and stops the intent's watchers", async function () {
            const props = reactive({ pkKey: "contactId", params: { page: 1 }, intendToList: true });
            const { wrapper } = mountWithSetup(() => useListSubscription({ props, handlers: { list: crudList } }));
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            wrapper.unmount();
            await flushPromises();
            expect(crudListResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);

            // settle the cancel, so a stalled intent cannot pass for a disposed one
            crudListResolvable[0].cancel.resolve();
            crudListResolvable[0].reject("cancelled");
            await settle();

            props.params = { page: 2 };
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);
        });

        it("cannot stop a non-cancellable run, which still writes into the instance", async function () {
            // a plain promise, so disposal has no cancel to call
            const gate = new Resolvable();
            const list = vi.fn().mockImplementation(({ pushObjects }) =>
                gate.promise.then(() => {
                    pushObjects([{ contactId: 1, name: "Ada" }]);
                })
            );
            const props = reactive({ pkKey: "contactId", params: { page: 1 }, intendToList: true });
            const { wrapper, created } = mountWithSetup(() => useListSubscription({ props, handlers: { list } }));
            await settle();
            expect(list).toHaveBeenCalledTimes(1);

            wrapper.unmount();
            await flushPromises();
            expect(created.state.objects).toEqual({});

            gate.resolve();
            await settle();
            // the handler ran to completion after teardown, and its callback still landed
            expect(created.state.objects).toEqual({ 1: { contactId: 1, name: "Ada" } });
        });

        it("stops a derived layer from tracking its parent", async function () {
            const parentState = reactive({
                objects: { 1: { contactId: 1, name: "Bea" } },
                order: ["1"],
                objectsInOrder: [{ contactId: 1, name: "Bea" }],
                pkKey: "contactId",
                loading: false,
                error: null,
                errored: false,
                running: false,
            });
            const { wrapper, created } = mountWithSetup(() =>
                useListSort({
                    parentState,
                    orderByRules: [{ key: "name", localeCompare: true }],
                    sortThrottleWait: 0,
                })
            );
            await settle();
            expect(created.state.order).toEqual(["1"]);

            wrapper.unmount();
            parentState.objects[2] = { contactId: 2, name: "Ada" };
            parentState.order = ["1", "2"];
            await settle();

            // the layer keeps its last computed order instead of reordering
            expect(created.state.order).toEqual(["1"]);
        });
    });

    describe("a manager's stop", function () {
        it("disposes every layer, while the instance still takes data", async function () {
            const scope = effectScope();
            const manager = scope.run(() =>
                useList({
                    props: reactive({
                        pkKey: "contactId",
                        params: { page: 1 },
                        orderByRules: [{ key: "name", localeCompare: true }],
                    }),
                    handlers: { list: crudList },
                    sortThrottleWait: 0,
                })
            );
            manager.pushObjects([{ contactId: 1, name: "Bea" }]);
            await settle();
            expect(manager.state.order).toEqual(["1"]);

            manager.stop();
            manager.pushObjects([{ contactId: 2, name: "Ada" }]);
            await settle();

            // the instance has no watchers to dispose, so it still accepts rows
            expect(Object.keys(manager.managed.listInstance.state.objects)).toEqual(["1", "2"]);
            // the composed view stopped following it
            expect(manager.state.order).toEqual(["1"]);
            scope.stop();
        });
    });

    describe("a cached owner", function () {
        /**
         * Mount `Child` inside a KeepAlive whose rendering is driven by `shown.value`.
         * @param {import("vue").Component} Child - The component to cache.
         * @param {{ value: boolean }} shown - Reactive toggle deciding whether the child renders.
         * @returns {import("@vue/test-utils").VueWrapper} The mounted wrapper.
         */
        const mountCached = (Child, shown) =>
            mount(
                defineComponent({
                    setup() {
                        return () => h("div", [h({ ...KeepAlive }, () => (shown.value ? h(Child) : null))]);
                    },
                })
            );

        const makeChild = (props, list) =>
            defineComponent({
                setup() {
                    useListSubscription({ props, handlers: { list } });
                    return () => h("div");
                },
            });

        it("is not disposed, so deactivation cancels the run but leaves the watchers live", async function () {
            const props = reactive({ pkKey: "contactId", params: { page: 1 }, intendToList: true });
            const shown = reactive({ value: true });
            const wrapper = mountCached(makeChild(props, crudList), shown);
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            shown.value = false;
            await settle();
            expect(crudListResolvable[0].promise.cancel).toHaveBeenCalledTimes(1);
            crudListResolvable[0].cancel.resolve();
            crudListResolvable[0].reject("cancelled");
            await settle();

            // deactivation is not a pause: an input change still starts a run for a cached screen
            props.params = { page: 2 };
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }, { page: 2 }]);
            wrapper.unmount();
        });

        it("reruns the intent on activation even when no input changed", async function () {
            const props = reactive({ pkKey: "contactId", params: { page: 1 }, intendToList: true });
            const shown = reactive({ value: true });
            const wrapper = mountCached(makeChild(props, crudList), shown);
            await settle();
            crudListResolvable[0].resolve([]);
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            shown.value = false;
            await settle();
            expect(paramsSeen()).toEqual([{ page: 1 }]);

            shown.value = true;
            await settle();
            // deactivation forgot the inputs the intent had seen, so activation lists again
            expect(paramsSeen()).toEqual([{ page: 1 }, { page: 1 }]);
            wrapper.unmount();
        });
    });
});
