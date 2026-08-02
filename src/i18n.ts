import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-http-backend";
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
        const storedLanguage = localStorage.getItem("i18nextLng") || "en";

        if (!["en", "tr"].includes(storedLanguage)) {
            console.log("Unsupported language in localStorage, setting to default English.");
            localStorage.setItem("i18nextLng", "en");
        }

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
                lng: storedLanguage,
                detection: Localize.LANG_DETECTION_OPTIONS,
                retryTimeout: 350,
                maxRetries: 5,
            });
    }

    public static init(): void {
        this.initI18n();
    }

    public static translate(key: string, options?: object): string {
        if (typeof key !== "string") {
            throw new Error("Input type for i18next localization must be string.");
        }
        return i18next.t(key, options);
    }

    // Made static and refactored to avoid duplicate event listeners if called multiple times.
    public static changeLanguageViaI18n(buttonId: string, language: "en" | "tr") {
        if (!["en", "tr"].includes(language)) {
            console.error(`Language ${language} is not supported.`);
            return;
        }

        const targetBtn = document.getElementById(buttonId) as HTMLButtonElement;
        if (targetBtn) {
            // Remove existing listener to prevent duplicates if this function is called multiple times
            const oldListener = (targetBtn as any)._languageChangeListener;
            if (oldListener) {
                targetBtn.removeEventListener("click", oldListener);
            }

            const newListener = () => {
                if (i18next.language === language) {
                    console.log("Language is already set to target language:", language);
                    return;
                } else {
                    localStorage.setItem("i18nextLng", language);
                    window.location.reload(); // Refresh the site after language changes
                }
            };
            targetBtn.addEventListener("click", newListener);
            (targetBtn as any)._languageChangeListener = newListener;
        } else {
            console.error(`Button ${buttonId} does not exist.`);
            return;
        }
    }
}

export default Localize;