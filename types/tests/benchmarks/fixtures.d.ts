export namespace benchmarkOptions {
    let iterations: number;
    let time: number;
    let warmupIterations: number;
    let warmupTime: number;
}
export function makeRows(count: number, start?: number): {
    id: number;
    name: string;
}[];
export function makeRichRows(count: number, start?: number): {
    id: number;
    name: string;
    organization: number;
}[];
/** Related objects the populated related rule resolves against. */
export const relatedOrganizations: {
    [k: string]: {
        id: number;
        name: string;
    };
};
export namespace emptyRules {
    let allowedFilter: any;
    let calculatedObjectsRules: {};
    let excludedFilter: any;
    let orderByRules: any[];
    let relatedObjectsRules: {};
    let textSearchRules: any[];
    let textSearchValue: string;
}
export namespace populatedRules {
    export function allowedFilter_1(object: any): boolean;
    export { allowedFilter_1 as allowedFilter };
    export namespace calculatedObjectsRules_1 {
        function doubled(object: any): number;
    }
    export { calculatedObjectsRules_1 as calculatedObjectsRules };
    let excludedFilter_1: any;
    export { excludedFilter_1 as excludedFilter };
    let orderByRules_1: {
        key: string;
        desc: boolean;
        localeCompare: boolean;
    }[];
    export { orderByRules_1 as orderByRules };
    export namespace relatedObjectsRules_1 {
        namespace org {
            export let pkKey: string;
            export { relatedOrganizations as objects };
        }
    }
    export { relatedObjectsRules_1 as relatedObjectsRules };
    let textSearchRules_1: any[];
    export { textSearchRules_1 as textSearchRules };
    let textSearchValue_1: string;
    export { textSearchValue_1 as textSearchValue };
}
export function makeList(rules?: object): ReturnType<typeof useList>;
import { useList } from "../../use/list.js";
