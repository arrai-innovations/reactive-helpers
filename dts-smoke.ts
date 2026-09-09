// Minimal import to force-check the published declaration surface.
import { useObjectInstance, useListInstance } from "@arrai-innovations/reactive-helpers";

void useObjectInstance;
void useListInstance;

const listRelatedRule: import("@arrai-innovations/reactive-helpers").ListRelatedRule = {
    objects: {},
    fkKey: "companyId",
    // @ts-expect-error Related rules no longer accept the pkKey alias.
    pkKey: "companyId",
};
const objectRelatedRule: import("@arrai-innovations/reactive-helpers").ObjectRelatedRule = {
    objects: {},
    fkKey: "companyId",
    // @ts-expect-error Related rules no longer accept the pkKey alias.
    pkKey: "companyId",
};

void listRelatedRule;
void objectRelatedRule;
