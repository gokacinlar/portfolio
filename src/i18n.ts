import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend"
// English
import EnNs1 from "./locales/en/en.json";
// Turkish
import TrNs1 from "./locales/tr/tr.json";

export const defaultNS = "common";
export const resources = {
    en: {
        common: EnNs1,
    },
    tr: {
        common: TrNs1,
    },
};

class Localize {
    private static readonly LANG_DETECTION_OPTIONS: Object = {
        order: ["querystring", "navigator"],
        lookupQuerystring: "lng",
        lookupCookie: "i18next",
        lookupLocalStorage: "i18nextLng",
        caches: ["localStorage", "cookie"],
    }

    private static initI18n(): void {
        i18next
            .use(XHR)
            .use(LanguageDetector)
            .init({
                load: "languageOnly",
                debug: false,
                fallbackLng: "en",
                defaultNS: "common",
                ns: ["common"],
                resources,
                interpolation: { escapeValue: false },
                supportedLngs: ["en", "tr"],
                detection: Localize.LANG_DETECTION_OPTIONS,
                retryTimeout: 350,
                maxRetries: 5,
            });
    }

    public static init(): void {
        this.initI18n();
    }

    public static translate(key: string): string {
        if (typeof key !== "string") {
            throw new Error("Input type for i18next localization must be string.");
        }
        return i18next.t(key);
    }
}

export default Localize;