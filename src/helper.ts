import { HeroParts, PromoParts } from "./static";

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
            textSpan.textContent = "Hire me!";
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
            } else {
                dayNightModeSwitchingBtn.classList.remove("bi-moon-stars");
                dayNightModeSwitchingBtn.classList.add("bi-sun");
            }
            // Reset the flag
            reset = !reset;
        });
    }
}

// Typewriter effect on Hero section
export class TypeWriterDisplay {
    private targetElement: HTMLElement
    private heroParts: HeroParts;
    private textIndex: number = 0;
    private charIndex: number = 0;
    private isDeleting: boolean = false;

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

        let delay = 100;

        if (!this.isDeleting) {
            if (this.charIndex < currentText.length) {
                this.charIndex++;
            } else {
                // When full word is written, pause before deleting
                delay = 2000;
                this.isDeleting = true;
            }
        } else {
            if (this.charIndex > 0) {
                this.charIndex--;
                delay = 50;
            } else {
                // Move to next word
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.heroParts.occupationsData.length;
                delay = 500;
            }
        }

        setTimeout(() => {
            this.type();
        }, delay);
    }
}

export class PromoFunctions {
    private promoParts: PromoParts;
    constructor() {
        this.promoParts = new PromoParts();
    }

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
            img.className = "marquee-item-img img-fluid img-responsive rounded-4";
            img.title = item.title;
            img.src = item.imgSrc;
            img.setAttribute("loading", "lazy");
            img.setAttribute("decoding", "async");

            anchor.appendChild(img);
            container.appendChild(anchor);
        }

    }
}