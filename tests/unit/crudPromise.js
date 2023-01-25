export class Resolvable {
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

export class CancellableResolvable {
    constructor() {
        const newResolvable = new Resolvable();
        const cancelResolvable = new Resolvable();
        newResolvable.promise.cancel = jest
            .fn()
            .mockImplementationOnce(async () => {
                return cancelResolvable.promise;
            })
            .mockRejectedValue(new Error("cancel already called"));
        Object.assign(this, newResolvable);
        this.cancel = cancelResolvable;
    }
}
