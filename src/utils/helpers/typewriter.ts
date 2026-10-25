import { HeroParts } from "../../static";

// Typewriter effect on Hero section
export class TypeWriterDisplay {
    private targetElement: HTMLElement
    private heroParts: HeroParts;
    private textIndex: number = 0;
    private charIndex: number = 0;
    private isDeleting: boolean = false;
    private timeoutId: ReturnType<typeof setTimeout> | null = null;
    private destroyed: boolean = false;

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
        if (this.destroyed) return;

        const currentText = this.heroParts.occupationsData[this.textIndex];

        if (!currentText) {
            console.error("Please provide text for typing effect.");
            return;
        }

        const displayedText = currentText.substring(0, this.charIndex);
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

        this.timeoutId = setTimeout(() => {
            this.type();
        }, typingDelay);
    }

    public destroy(): void {
        this.destroyed = true;
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}
