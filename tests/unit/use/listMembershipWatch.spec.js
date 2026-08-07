import flushPromises from "flush-promises";
import { effectScope, nextTick, reactive, toRef } from "vue";
import { poll } from "../poll.js";
import { scopedIt } from "../scopedIt.js";

// watchMembershipChanged is a thin wrapper over Vue's watch, so these pin the two things a consumer
// cannot see from the name alone: that the callback reports an occurrence and carries no payload, and
// that the caller's scope owns the watcher rather than the layer that handed it out.
describe("use/list watchMembershipChanged", () => {
    let useListInstance, useListFilter, useList;
    beforeEach(async () => {
        ({ useListInstance } = await import("../../../use/listInstance.js"));
        ({ useListFilter } = await import("../../../use/listFilter.js"));
        ({ useList } = await import("../../../use/list.js"));
    });

    // Held local, and named so it does not get reused as a general wait: it exists only for the
    //  assertions that no further callback arrives, which have no condition to poll for. Real time
    //  matters because the composed list carries a search layer over an asynchronous index.
    const settleNothingHappens = async () => {
        for (let round = 0; round < 3; round++) {
            await new Promise((resolve) => setTimeout(resolve, 60));
            await nextTick();
            await flushPromises();
        }
    };

    const makeFiltered = () => {
        const props = reactive({ pkKey: "id", allowedFilter: undefined, excludedFilter: undefined });
        const list = useListInstance({ props });
        const filter = useListFilter({
            parentState: list.state,
            allowedFilter: toRef(props, "allowedFilter"),
            excludedFilter: toRef(props, "excludedFilter"),
        });
        return { props, list, filter };
    };

    scopedIt("calls back when the layer's membership changes", async () => {
        const { list, filter } = makeFiltered();
        let calls = 0;
        filter.watchMembershipChanged(() => {
            calls++;
        });

        list.addListObject({ id: 1, name: "one" });
        await nextTick();

        expect(calls).toBe(1);
    });

    scopedIt("passes the callback no arguments, so the counter never surfaces", async () => {
        const { list, filter } = makeFiltered();
        /** @type {any[][]} */
        const received = [];
        filter.watchMembershipChanged((...args) => {
            received.push(args);
        });

        list.addListObject({ id: 1, name: "one" });
        await nextTick();

        expect(received).toEqual([[]]);
    });

    scopedIt("stays quiet when a record changes without moving membership", async () => {
        const { list, filter } = makeFiltered();
        list.addListObject({ id: 1, name: "one" });
        await nextTick();
        let calls = 0;
        filter.watchMembershipChanged(() => {
            calls++;
        });

        list.updateListObject({ id: 1, name: "one renamed" });
        await settleNothingHappens();

        expect(calls).toBe(0);
    });

    scopedIt("calls back on a rule change that only this layer sees", async () => {
        const { props, list, filter } = makeFiltered();
        list.addListObject({ id: 1, name: "one" });
        list.addListObject({ id: 2, name: "two" });
        await nextTick();
        let filterCalls = 0;
        let instanceCalls = 0;
        filter.watchMembershipChanged(() => {
            filterCalls++;
        });
        list.watchMembershipChanged(() => {
            instanceCalls++;
        });

        props.allowedFilter = (object) => object.id === 1;
        await poll(() => filterCalls === 1);

        // The instance's collection did not move, so only the layer whose membership changed hears it.
        expect(filterCalls).toBe(1);
        expect(instanceCalls).toBe(0);
    });

    scopedIt("honours immediate and returns a working stop handle", async () => {
        const { list, filter } = makeFiltered();
        let calls = 0;
        const stop = filter.watchMembershipChanged(
            () => {
                calls++;
            },
            { immediate: true }
        );
        expect(calls).toBe(1);

        stop();
        list.addListObject({ id: 1, name: "one" });
        await settleNothingHappens();

        expect(calls).toBe(1);
    });

    scopedIt("belongs to the caller's effect scope, not to the layer", async () => {
        const { list, filter } = makeFiltered();
        let callerScoped = 0;
        let outerScoped = 0;
        const callerScope = effectScope();
        callerScope.run(() => {
            filter.watchMembershipChanged(() => {
                callerScoped++;
            });
        });
        const stopOuter = filter.watchMembershipChanged(() => {
            outerScoped++;
        });

        // Disposing the scope the watcher was registered in stops it. The other one, registered in
        //  this test's scope, keeps hearing.
        callerScope.stop();
        list.addListObject({ id: 1, name: "one" });
        await nextTick();
        expect(callerScoped).toBe(0);
        expect(outerScoped).toBe(1);

        // Disposing the layer does not dispose the watcher, since the layer never owned it. It does
        //  silence it: a stopped layer publishes no further membership changes. The handle stays the
        //  caller's to call.
        filter.stop();
        list.addListObject({ id: 2, name: "two" });
        await nextTick();
        expect(outerScoped).toBe(1);
        expect(() => stopOuter()).not.toThrow();
    });

    scopedIt("reports the composed list's own membership", async () => {
        const props = reactive({
            allowedFilter: (object) => object.id === 1,
            excludedFilter: undefined,
            calculatedObjectsRules: {},
            relatedObjectsRules: {},
            customDocumentOptions: {},
            customSearchOptions: {},
            intendToList: false,
            intendToSubscribe: false,
            orderByRules: [],
            params: {},
            pkKey: "id",
            target: {},
            textSearchRules: [],
            textSearchValue: "",
        });
        const list = useList({ props, sortThrottleWait: 0 });
        let composedCalls = 0;
        let instanceCalls = 0;
        list.watchMembershipChanged(() => {
            composedCalls++;
        });
        list.managed.listInstance.watchMembershipChanged(() => {
            instanceCalls++;
        });

        // useList hands out the sort layer's state, so its watcher reports what that layer holds. The
        //  excluded record moves the instance's collection and not the composed one.
        list.pushObjects([{ id: 2, name: "two" }]);
        await poll(() => instanceCalls === 1);
        await settleNothingHappens();

        expect(instanceCalls).toBe(1);
        expect(composedCalls).toBe(0);

        list.pushObjects([{ id: 1, name: "one" }]);
        await poll(() => composedCalls === 1);

        expect(instanceCalls).toBe(2);
        expect(composedCalls).toBe(1);
        list.stop();
    });
});
