export function useListSubscriptions(instances, args) {
    for (const [key, value] of Object.entries(args)) {
        useListSubscription({ listInstance: instances[key], ...value });
    }
}

export default function useListSubscription({ listInstance }) {
    listInstance.subscribe = function subscribe() {};
    listInstance.unsubscribe = function unsubscribe() {};
}
