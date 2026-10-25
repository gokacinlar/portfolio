import Toastify from "toastify-js";
import { TOAST_CONFIG } from "./toast";

// Detecting dark/light mode
export class DarkLightMode {
    private static singleton: DarkLightMode | null = null;
    private mediaQuery: MediaQueryList;
    private currentTheme: "dark" | "light" | "auto" = "auto";
    private iconElement: HTMLElement | null = null;
    private darkLightButton: HTMLButtonElement | null = null;
    private mediaQueryListener: (() => void) | null = null; // Store listener for removal
    private darkLightClickHandler: (() => void) | null = null;

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.initialize();
    }

    public static getInstance(): DarkLightMode {
        if (!DarkLightMode.singleton) {
            DarkLightMode.singleton = new DarkLightMode();
        }
        return DarkLightMode.singleton;
    }

    public static destroyInstance(): void {
        if (DarkLightMode.singleton) {
            DarkLightMode.singleton.destroy();
            DarkLightMode.singleton = null;
        }
    }

    private initialize(): void {
        this.loadThemeFromStorage();
        this.applyTheme();
        // Store the bound function to ensure we remove the correct listener
        this.mediaQueryListener = this.handleSystemThemeChange.bind(this);
        this.mediaQuery.addEventListener("change", this.mediaQueryListener);
    }

    private handleSystemThemeChange(): void {
        if (this.currentTheme === "auto") {
            this.applyTheme();
            this.updateIcon();
        }
    }

    private loadThemeFromStorage(): void {
        try {
            const savedTheme = localStorage.getItem("userThemePreference");
            const options: Array<string> = ["dark", "light", "auto"];
            if (savedTheme && options.includes(savedTheme)) {
                this.currentTheme = savedTheme as "dark" | "light" | "auto";
            }
        } catch (error: unknown) {
            console.error("Could not load theme from localStorage.", error);
        }
    }

    private saveThemeToStorage(val: string): void {
        try {
            localStorage.setItem("userThemePreference", val);
        } catch (error: unknown) {
            console.error("Could not save theme to localStorage", error);
        }
    }

    private notifyUserAboutThemeChange(): void {
        Toastify({
            ...TOAST_CONFIG, // Using the centralized config
            text: `Saved your theme preference.`,
            close: false,
            duration: 2500,
            ariaLive: "polite"
        }).showToast();
    }

    // Dark-light mode switching happens here
    private applyTheme(): void {
        const effectiveTheme = this.getEffectiveTheme();

        document.documentElement.setAttribute("data-bs-theme", effectiveTheme);
        document.documentElement.setAttribute("data-theme", effectiveTheme);
    }

    // Function to get which mode is in effect in page
    private getEffectiveTheme(): "dark" | "light" {
        if (this.currentTheme === "auto") {
            return this.mediaQuery.matches ? "dark" : "light";
        }
        return this.currentTheme;
    }

    private updateIcon(): void {
        if (!this.iconElement) {
            return;
        }

        const effectiveTheme = this.getEffectiveTheme();
        if (effectiveTheme === "dark") {
            this.iconElement.classList.remove("bi-sun");
            this.iconElement.classList.add("bi-moon-stars");
        } else {
            this.iconElement.classList.remove("bi-moon-stars");
            this.iconElement.classList.add("bi-sun");
        }
    }

    public dayNightModeSwitching(elem: HTMLButtonElement, elemToBeManip: string): void {
        this.iconElement = document.querySelector(`${elemToBeManip}`) as HTMLElement;

        // Set initial icon state based on current theme
        this.updateIcon();
        if (!elem) {
            console.error("Cannot find element:" + elem);
            return;
        }

        // Remove previous click handler to avoid duplicate listeners on re-connect
        if (this.darkLightButton && this.darkLightClickHandler) {
            this.darkLightButton.removeEventListener("click", this.darkLightClickHandler);
        }

        this.darkLightButton = elem;
        this.darkLightClickHandler = () => {
            // Toggle between light and dark (override auto mode)
            const currentEffectiveTheme = this.getEffectiveTheme();
            this.currentTheme = currentEffectiveTheme === "dark" ? "light" : "dark";

            this.notifyUserAboutThemeChange();
            this.saveThemeToStorage(this.currentTheme);
            this.applyTheme();
            this.updateIcon();
        };

        elem.addEventListener("click", this.darkLightClickHandler);
    }

    // Method to clean up event listeners
    public destroy(): void {
        if (this.mediaQueryListener) {
            this.mediaQuery.removeEventListener("change", this.mediaQueryListener);
            this.mediaQueryListener = null;
        }
        if (this.darkLightButton && this.darkLightClickHandler) {
            this.darkLightButton.removeEventListener("click", this.darkLightClickHandler);
            this.darkLightClickHandler = null;
            this.darkLightButton = null;
        }
        this.iconElement = null;
    }
}
