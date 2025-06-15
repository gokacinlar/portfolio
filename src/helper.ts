import * as Type from "./types"
import { PromoCard } from "./components/promo";
import { HeroParts, PromoParts } from "./static";

// Detecting dark/light mode
export class DarkLightMode {
    public detectDarkLightMode(): void {
        const dlMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute("data-bs-theme", dlMode ? "dark" : "light");
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

// For DOM Manipulation
export class DomEvents {
    public headerRightActions(elem: HTMLButtonElement) {
        const textSpan = elem.querySelector(".hr-btn-text") as HTMLElement;
        elem.addEventListener("mouseover", () => {
            textSpan.textContent = "For your education & web demands...";
        });

        elem.addEventListener("mouseleave", () => {
            textSpan.textContent = "Work w/me!";
        });
    }

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
            p.classList.add("motto-elements", "p-3", "fs-6", "fw-bolder", "rounded-5", "pe-none", "shadow-sm")
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
    private promoParts: PromoParts;
    constructor() {
        this.promoParts = new PromoParts();
    }

    // Function to create project posts in promo component
    public createPromoPosts(target: string, posts: Type.PromoCardData[]) {
        const container = document.querySelector(`${target}`) as HTMLDivElement;
        if (container) {
            // Create an html element with map by rendering promo cards in renderPromoCard() with
            // posts as its data
            const cardsHTML = posts
                .map((post) => new PromoCard().renderPromoCard(post))
                .join("\n");
            container.innerHTML = cardsHTML;
        }
    }

    // Function to create marquee stack
    public createMarqueeStack(targetSelector: string) {
        const container = document.querySelector(`${targetSelector}`) as HTMLDivElement;
        if (!container) {
            return;
        }

        for (const item of this.promoParts.marqueeElements) {
            const anchor = document.createElement("a") as HTMLAnchorElement;
            anchor.className = "marquee-item";
            anchor.href = item.href;
            anchor.setAttribute("target", "_blank");

            const img = document.createElement("img") as HTMLImageElement;
            img.className = "marquee-item-img img-fluid img-responsive lazyload rounded-4";
            img.title = item.title;
            img.src = item.imgSrc;
            img.setAttribute("loading", "lazy");
            img.setAttribute("decoding", "async");

            anchor.appendChild(img);
            container.appendChild(anchor);
        }
    }
}