import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
// English
import EnNs1 from "./locales/en/ns1.json";
import EnFallback from "./locales/en/enFallback.json";
// Turkish
import TrNs1 from "./locales/tr/ns1.json";
import TrFallback from "./locales/tr/trFallback.json";

interface Resources {
    [key: string]: {
        [namespace: string]: any; //lazy
    };
}

const resources: Resources = {
    en: {
        ns1: EnNs1,
        fallback: EnFallback,
    },
    tr: {
        ns1: TrNs1,
        fallback: TrFallback,
    },
};

export class Localize {
    private static initI18n(): void {
        i18next
            .use(LanguageDetector)
            .init({
                debug: false,
                fallbackLng: "en",
                defaultNS: "ns1",
                fallbackNS: "fallback",
                ns: ["ns1", "ns2", "fallback"],
                resources,
                interpolation: { escapeValue: false },
                supportedLngs: ["en", "tr"],
                detection: {
                    order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
                    lookupQuerystring: "lng",
                    lookupCookie: "i18next",
                    lookupLocalStorage: "i18nextLng",
                    caches: ["localStorage", "cookie"],
                },
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
