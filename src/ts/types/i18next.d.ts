import { resources, defaultNS } from "../../../i18n";

type ResourceKeys = keyof typeof resources.en.common;

declare module "i18next" {
    interface CustomTypeOptions {
        defaultNS: typeof defaultNS;
        resources: {
            en: {
                common: typeof resources.en.common;
            };
            tr: {
                common: typeof resources.tr.common;
            };
        };
    }
}
