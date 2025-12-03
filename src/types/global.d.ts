import type * as bootstrap from "bootstrap";
import Resources from "./resources";

declare global {
    interface Window {
        bootstrap: typeof bootstrap;
    }
}

declare module "i18next" {
    interface CustomLocalizationTypeOptions {
        defaultNS: "ns1",
        resources: Resources;
    }
}