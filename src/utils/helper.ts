import "toastify-js/src/toastify.css"
import DOMPurify from "dompurify";
import ScrollReveal from "scrollreveal";
import Toastify from "toastify-js";
import { HeroParts, WhiteListedURLs } from "../static";

// Centralized Toastify configuration
export const TOAST_CONFIG = {
    duration: 2500,
    newWindow: true,
    close: true,
    avatar: "../assets/images/static/webp/logo.webp",
    gravity: "bottom" as const,
    position: "center" as const,
    stopOnFocus: true,
    style: {
        background: "#0f3d75",
        borderRadius: "24px"
    },
} as const;

// Detecting dark/light mode
export class DarkLightMode {
    private mediaQuery: MediaQueryList;
    private currentTheme: "dark" | "light" | "auto" = "auto";
    private iconElement: HTMLElement | null = null;
    private mediaQueryListener: (() => void) | null = null; // Store listener for removal

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        this.initialize();
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

    public dayNightModeSwitching(elem: HTMLButtonElement, elemToBeManip: string) {
        this.iconElement = document.querySelector(`${elemToBeManip}`) as HTMLElement;

        // Set initial icon state based on current theme
        this.updateIcon();
        elem.addEventListener("click", () => {
            // Toggle between light and dark (override auto mode)
            const currentEffectiveTheme = this.getEffectiveTheme();
            this.currentTheme = currentEffectiveTheme === "dark" ? "light" : "dark";

            this.notifyUserAboutThemeChange();
            this.saveThemeToStorage(this.currentTheme);
            this.applyTheme();
            this.updateIcon();
        });
    }

    // Method to clean up event listeners
    public destroy(): void {
        if (this.mediaQueryListener) {
            this.mediaQuery.removeEventListener("change", this.mediaQueryListener);
            this.mediaQueryListener = null;
        }
    }
}

// Create a template content to be appended to every Light DOM
export class Template {
    private nonce: string;
    constructor() { this.nonce = generateNonce() };

    public createTemplate(content: string, target: HTMLElement): HTMLTemplateElement {
        if (typeof content !== "string" || !content.trim()) {
            throw new Error("Template content must be a non-empty string");
        }

        const template = document.createElement("template") as HTMLTemplateElement;
        const sanitizedContent = DOMPurify.sanitize(content, {
            ADD_ATTR: ["nonce"],
            CUSTOM_ELEMENT_HANDLING: {
                tagNameCheck: /^[a-z]+-/,
                attributeNameCheck: /.*/,
                allowCustomizedBuiltInElements: false,
            }
        });

        template.innerHTML = sanitizedContent;
        try {
            if (!content || !target) {
                throw new Error("Content or target does not exist.");
            }

            const fragment = template.content.cloneNode(true) as DocumentFragment;
            // Add nonce to all style and script elements if nonce exists
            if (this.nonce) {
                fragment.querySelectorAll("style, script").forEach((element) => {
                    element.setAttribute("nonce", this.nonce);
                });
            }

            target.appendChild(fragment);
            return template;
        } catch (error: unknown) {
            throw new Error("Unable to append template content as a web component: " + error);
        }
    }
}

// Function to scroll horizontally in desired div
export class HorizontalMiddleMouseScroll {
    // hmmsScroll now returns a cleanup function
    public hmmsScroll(element: string): () => void {
        const elem = document.querySelector(element) as HTMLElement;
        if (!elem) return () => { }; // Return a no-op cleanup if element not found

        let isScrolling: boolean = false;
        let targetScrollLeft: number = elem.scrollLeft;

        // Function to handle scroll behavior
        const handleScroll = (e: WheelEvent) => {
            e.preventDefault();

            // Move the content in Y axis with deltaY property
            const scrollAmount = e.deltaY < 0 ? -35 : 35;
            targetScrollLeft += scrollAmount;

            if (!isScrolling) {
                isScrolling = true;
                requestAnimationFrame(() => {
                    elem.scrollTo({
                        left: targetScrollLeft,
                        behavior: "smooth"
                    });
                    isScrolling = false;
                });
            }
        };

        // Function to check viewport and toggle scroll behavior
        const updateScrollBehavior = () => {
            const isMobileView: boolean = window.innerWidth <= 1024;

            // Remove existing listener to avoid duplicates
            elem.removeEventListener("wheel", handleScroll);

            // Add listener only in mobile view
            if (isMobileView) {
                elem.addEventListener("wheel", handleScroll);
            }
        };

        // Initial check
        updateScrollBehavior();

        // Listen for window resize events to update behavior
        window.addEventListener("resize", updateScrollBehavior);

        // Return a cleanup function for all listeners added by this instance
        return () => {
            elem.removeEventListener("wheel", handleScroll);
            window.removeEventListener("resize", updateScrollBehavior);
        };
    }
}

// For DOM Manipulation
export class DomEvents {
    // Function to append mottos into DOM with sequential order
    public async appendContent(target: HTMLElement, content: Array<string>): Promise<void> {
        for (let i in content) {
            let p = document.createElement("p") as HTMLParagraphElement;
            p.textContent = content[i];
            p.className = "motto-element p-3 fs-6 fw-bolder rounded-5 pe-none shadow-sm mb-0"
            // Use promise-resolve to sequentially place the array items into dom
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    target.appendChild(p);
                    resolve();
                }, 1000);
            });
        }
    }
}

// Typewriter effect on Hero section
export class TypeWriterDisplay {
    private targetElement: HTMLElement
    private heroParts: HeroParts;
    private textIndex: number = 0;
    private charIndex: number = 0;
    private isDeleting: boolean = false;

    // Initialize the core elements
    constructor(heroParts: HeroParts, elementId: string) {
        this.heroParts = heroParts;
        const targetElement = document.getElementById(elementId);

        if (targetElement) {
            this.targetElement = targetElement;
        } else {
            throw new Error(`Target element not found`);
        }

        this.targetElement = targetElement;
        this.type();
    }

    private type(): void {
        const currentText = this.heroParts.occupationsData[this.textIndex];
        let displayedText = currentText.substring(0, this.charIndex);

        const textSpan = this.targetElement.querySelector(".ocps-written-text");
        if (textSpan) {
            textSpan.textContent = displayedText;
        }

        let typingDelay = 100;
        if (!this.isDeleting) {
            if (this.charIndex < currentText.length) {
                this.charIndex++;
            } else {
                // When full word is written, pause before deleting
                typingDelay = 2000;
                this.isDeleting = true;
            }
        } else {
            if (this.charIndex > 0) {
                this.charIndex--;
                typingDelay = 50;
            } else {
                // Move to next word
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.heroParts.occupationsData.length;
                typingDelay = 500;
            }
        }

        setTimeout(() => {
            this.type();
        }, typingDelay);
    }
}

export class PromoFunctions {
    // Function to create html elements wrapped in desired content
    public createPromoContent(target: string, posts: any[], renderFunction: (post: any) => string) {
        const container = document.querySelector(`${target}`) as HTMLDivElement;
        if (container) {
            const cardsHTML = posts
                // Map the elements with desired content
                .map((post) => renderFunction(post))
                .join("\n");
            const cleaned = DOMPurify.sanitize(cardsHTML);
            container.innerHTML = cleaned;
        }
    }

    public createVerticalTabContent(target: string, data: any): void {
        const container = document.getElementById("tabGroupDetailsLister") as HTMLDivElement;
        if (!container || !data[target]) {
            return;
        } else {
            const { iconData, desc } = data[target];
            container.innerHTML = ""; // Clear previous content

            const wrapper = document.createElement("section");
            const icon = document.createElement("i");
            wrapper.className = "promo-tab-content h-100 d-flex flex-column align-items-center justify-content-evenly";
            icon.className = `promo-tc-icon ${iconData}`;

            const p = document.createElement("p");
            p.className = "text-center text-break fs-4 w-100";
            p.textContent = desc;

            wrapper.appendChild(icon);
            wrapper.appendChild(p);
            container.appendChild(wrapper);
        }
    }

    public bindVerticalTabEventsAndautoCycleTabs(data: any): void {
        const buttons = Array.from(document.querySelectorAll(".promo-desc-tab-group-btn")) as HTMLButtonElement[];
        if (!buttons.length) {
            return;
        }

        let index: number = 0;
        let duration: number = 5000;
        let activeInterval: ReturnType<typeof setInterval> | null = null;

        // Mobile & viewport detection
        const isMobile = () => window.innerWidth <= 768;
        const isElementInViewport = (el: HTMLElement): boolean => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            return rect.top < windowHeight && rect.bottom > 0;
        };

        // Helper function to scroll active tab into view (mobile + visible only)
        const scrollToActiveTab = (activeButton: HTMLButtonElement) => {
            if (!isMobile()) {
                return;
            }

            if (!isElementInViewport(activeButton)) {
                return;
            }

            activeButton.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center"
            });
        };

        const clearAllProgressBars = () => {
            buttons.forEach(btn => {
                const bar = btn.querySelector(".progress-bar") as HTMLDivElement;
                if (bar) {
                    bar.style.width = "0%";
                    bar.classList.remove("progress-bar-animated");
                }
            });

            if (activeInterval) {
                clearInterval(activeInterval);
                activeInterval = null;
            }
        };

        const startProgressForButton = (button: HTMLButtonElement) => {
            clearAllProgressBars();

            const progressBar = button.querySelector(".progress-bar") as HTMLDivElement;
            if (!progressBar) return;

            progressBar.style.width = "0%";
            progressBar.classList.add("progress-bar-animated");

            let progress = 0;
            const step = 100 / (duration / 100);

            activeInterval = setInterval(() => {
                progress += step;
                progressBar.style.width = `${progress}%`;

                if (progress >= 100) {
                    clearInterval(activeInterval!);
                    activeInterval = null;

                    // Go to next tab
                    index = (index + 1) % buttons.length;
                    const nextButton = buttons[index];
                    const type = nextButton.getAttribute("data-type");

                    if (type) {
                        this.createVerticalTabContent(type, data);
                        scrollToActiveTab(nextButton);
                    }
                    startProgressForButton(nextButton);
                }
            }, 100);
        };

        // Bind click events to buttons
        buttons.forEach((btn, i) => {
            btn.addEventListener("click", () => {
                index = i;
                const type = btn.getAttribute("data-type");
                if (type) {
                    this.createVerticalTabContent(type, data);
                    startProgressForButton(btn);
                    scrollToActiveTab(btn);
                }
            });
        });

        // Auto-start from the first tab
        if (buttons.length > 0) {
            const initialType = buttons[index].getAttribute("data-type");
            if (initialType) {
                this.createVerticalTabContent(initialType, data);
                scrollToActiveTab(buttons[index]);
                startProgressForButton(buttons[index]);
            }
        }
    }
}

export class ScrollRevealAction {
    public scrollReveal(classes: Array<string>) {
        for (const id of classes) {
            ScrollReveal().reveal(`.${id}`), { delay: 15000 };
        }
    }
}

export function formatDate(date: Date): String {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
};

// Function to generate nonce for each script tag
export function generateNonce(): string {
    try {
        // csp-html-webpack-plugin adds nonce to script tags automatically
        const scriptWithNonce = document.querySelector("script[nonce]") as HTMLScriptElement;
        if (scriptWithNonce) {
            return scriptWithNonce.getAttribute("nonce") || "";
        }

        // check nonce in styletags
        const styleWithNonce = document.querySelector("style[nonce]") as HTMLStyleElement;
        if (styleWithNonce) {
            return styleWithNonce.getAttribute("nonce") || "";
        }

        console.warn("No nonce found. CSP may block dynamic content.");
        return "";
    } catch (error: unknown) {
        console.error("Error retrieving nonce:", error);
        return "";
    }
}

interface ScriptOptions {
    scriptItself: string;
    target: HTMLElement;
    attributes?: ScriptAttributes;
}

interface ScriptAttributes {
    src?: string | null;
    defer?: boolean;
    async?: boolean;
    nonce?: string;
    crossorigin?: "anonymous" | "use-credentials";
}

// Function to insert custom script into the page
export function insertApprovedScript({ scriptItself, target, attributes = {} }: ScriptOptions): HTMLScriptElement {
    if (!target) {
        throw new Error(`Unable to insert script. ${target} element does not exist.`);
    }

    // Validate script source against the whitelist
    if (!WhiteListedURLs.approvedScripts.has(scriptItself)) {
        throw new Error(`Script source ${scriptItself} is not approved. Aborting procedure...`);
    }

    try {
        const element = document.createElement("script") as HTMLScriptElement;
        element.src = scriptItself;
        element.defer = attributes.defer ?? false;
        element.async = attributes.async ?? false;

        // Generate nonce for each creation
        const nonceGenerated = generateNonce();
        element.nonce = nonceGenerated;
        target.appendChild(element);
        return element;
    } catch (error: unknown) {
        throw new Error(`Failed to create script ${scriptItself}: ${error}`);
    }
}

export function insertToastifiedMessage(message: string) {
    try {
        const msg = message as string;
        if (msg) {
            Toastify({
                ...TOAST_CONFIG, // Using the centralized config
                text: msg,
                close: false,
                duration: 2500,
                ariaLive: "polite"
            }).showToast();
        }
    } catch (error: unknown) {
        throw new Error("Unable to insert toastify message" + error);
    }
}

export function addBackgroundBasedOnVerticalScroll(mainElement: string, target: string, className: string): () => void {
    const mainHtmlElement = document.getElementById(mainElement) as HTMLElement;
    const targetHtmlElement = document.getElementById(target) as HTMLElement;

    if (!mainHtmlElement && !targetHtmlElement) {
        console.warn(`Elements with id "${mainElement} and ${target}" not found`);
        return () => { };
    }

    const handleScroll = () => {
        if (mainHtmlElement.scrollTop > 15) {
            targetHtmlElement.classList.add(className);;
        } else if (mainHtmlElement.scrollTop <= 15) {
            targetHtmlElement.classList.remove(className);
        }
    };

    mainHtmlElement.addEventListener("scroll", handleScroll);
    handleScroll();

    // Return a clean state after all
    return () => mainHtmlElement.removeEventListener("scroll", handleScroll);
}