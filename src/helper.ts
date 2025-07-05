import ScrollReveal from "scrollreveal";
import { HeroParts } from "./static";

// Detecting dark/light mode
export class DarkLightMode {
    private mediaQuery: MediaQueryList;
    private currentTheme: "dark" | "light" | "auto" = "auto";

    constructor() {
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark');
        this.initialize();
    }

    private initialize(): void {
        // Set initial page theme
        this.applyTheme();
        // Listen for system theme changes (light/dark mode switching)
        this.mediaQuery.addEventListener("change", this.handleSystemThemeChange.bind(this));
    }

    private handleSystemThemeChange(): void {
        if (this.currentTheme === "auto") {
            this.applyTheme();
        }
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
}

// Create a template content to be appended to every Light DOM
export class Template {
    public createTemplate(content: any): HTMLTemplateElement {
        const template = document.createElement("template");
        template.innerHTML = `
            ${content}
        `;
        return template;
    }
}

// Function to scroll horizontally in desired div
export class HorizontalMiddleMouseScroll {
    public hmmsScroll(element: string) {
        const elem = document.querySelector(element) as HTMLElement;
        let isScrolling = false;
        let targetScrollLeft = elem.scrollLeft;

        // Function to handle scroll behavior
        const handleScroll = (e: WheelEvent) => {
            e.preventDefault();

            // Move the content in Y axis with deltaY property
            const scrollAmount = e.deltaY < 0 ? -30 : 30;
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
            const isMobileView = window.innerWidth < 599;

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
    }
}

// For DOM Manipulation
export class DomEvents {
    public dayNightModeSwitching(elem: HTMLButtonElement, elemToBeManip: string) {
        // Flag for reversing roles
        let reset = true;
        elem.addEventListener("click", () => {
            const dayNightModeSwitchingBtn = document.querySelector(`${elemToBeManip}`) as HTMLElement;
            if (reset) {
                dayNightModeSwitchingBtn.classList.remove("bi-sun");
                dayNightModeSwitchingBtn.classList.add("bi-moon-stars");
                document.documentElement.setAttribute("data-bs-theme", "dark");
            } else {
                dayNightModeSwitchingBtn.classList.remove("bi-moon-stars");
                dayNightModeSwitchingBtn.classList.add("bi-sun");
                document.documentElement.setAttribute("data-bs-theme", "light");
            }
            // Reset the flag
            reset = !reset;
        });
    }

    // Function to append mottos into DOM with sequential order
    public async appendContent(target: HTMLElement, content: Array<string>): Promise<void> {
        for (let i in content) {
            let p = document.createElement("p") as HTMLParagraphElement;
            p.textContent = content[i];
            p.classList.add("motto-element", "p-3", "fs-6", "fw-bolder", "rounded-5", "pe-none", "shadow-sm", "mb-0")
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
            container.innerHTML = cardsHTML;
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
            p.className = "text-center text-break fs-4 w-75";
            p.textContent = desc;

            wrapper.appendChild(icon);
            wrapper.appendChild(p);
            container.appendChild(wrapper);
        }
    }

    public bindVerticalTabEventsAndautoCycleTabs(data: any): void {
        const buttons = Array.from(document.querySelectorAll(".promo-desc-tab-group-btn")) as HTMLButtonElement[];
        if (!buttons.length) return;

        let index: number = 0;
        let duration: number = 5000;
        let activeInterval: ReturnType<typeof setInterval> | null = null;

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

        const startProgressForButton = (button: HTMLElement) => {
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

                    // Go to next
                    index = (index + 1) % buttons.length;
                    const nextButton = buttons[index];
                    const type = nextButton.getAttribute("data-type");
                    if (type) {
                        this.createVerticalTabContent(type, data);
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
                }
            });
        });

        // Auto-start from the first
        const initialType = buttons[index].getAttribute("data-type");
        if (initialType) {
            this.createVerticalTabContent(initialType, data);
            startProgressForButton(buttons[index]);
        }
    }
}

export class ScrollRevealAction {
    public scrollReveal(classes: Array<string>) {
        for (const id of classes) {
            ScrollReveal().reveal(`.${id}`), { delay: 10000 };
        }
    }
}