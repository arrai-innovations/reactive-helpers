import { ListError } from "./listInstance";

export class ListSubscriptionError extends Error {
    constructor(message) {
        super(message);
        this.name = "ListSubscriptionError";
    }
}

export function useListSubscriptions(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListSubscription({ listInstance: instances[key], ...value });
    }
}

export default function useListSubscription({ listInstance }) {
    listInstance.subscribe = function subscribe() {};
    listInstance.unsubscribe = function unsubscribe() {};

    listInstance.addFromSubscription = function addFromSubscription(data) {
        if (!data.id) {
            throw new ListError("addFromSubscription: data missing id.");
        }
        if (!(data.id in listInstance.objects)) {
            listInstance.objects[data.id] = data;
        } else {
            throw new ListError("addFromSubscription: add for existing data.");
        }
    };

    listInstance.updateFromSubscription = function updateFromSubscription(data) {
        if (!data.id) {
            throw new ListError("updateFromSubscription: data missing id.");
        }
        if (data.id in listInstance.objects) {
            listInstance.objects[data.id] = data;
        } else {
            throw new ListError("updateFromSubscription: update for missing data.");
        }
    };

    listInstance.deleteFromSubscription = function deleteFromSubscription(id) {
        if (!id) {
            throw new ListError("deleteFromSubscription: id required.");
        }
        if (id in listInstance.objects) {
            delete listInstance.objects[id];
        } else {
            throw new ListError("deleteFromSubscription: delete for missing data.");
        }
    };
}
