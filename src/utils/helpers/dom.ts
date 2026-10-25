// For DOM Manipulation
export class DomEvents {
    private pendingTimeouts: Set<ReturnType<typeof setTimeout>> = new Set();

    // Function to append mottos into DOM with sequential order
    public async appendContent(target: HTMLElement, content: Array<string>): Promise<void> {
        if (!target && !content) {
            console.error("Please provide DOM properties to be generated.");
            return;
        }

        try {
            for (const i in content) {
                const p = document.createElement("p") as HTMLParagraphElement;
                p.textContent = content[i] as string;
                p.className = "motto-element p-3 fs-6 fw-bolder rounded-5 pe-none shadow-sm mb-0"

                await new Promise<void>((resolve) => {
                    const id = setTimeout(() => {
                        this.pendingTimeouts.delete(id);
                        if (document.contains(target)) {
                            target.appendChild(p);
                        }
                        resolve();
                    }, 1000);
                    this.pendingTimeouts.add(id);
                });

                if (this.pendingTimeouts.size === 0 && !document.contains(target)) {
                    break;
                }
            }
        } catch (error: unknown) {
            throw new Error(`Error while generating motto elements: ${error}`)
        }
    }

    public destroy(): void {
        this.pendingTimeouts.forEach((id) => clearTimeout(id));
        this.pendingTimeouts.clear();
    }
}

export function colorfulBannerName(array: Array<string>, targetElement: string): void {
    if (!array) {
        console.error("Please provide an array.");
        return;
    }

    const colors: Array<string> = [
        "#70369D",
        "#4B369D",
        "#487DE7",
        "#79C314",
        "#FFFF00",
        "#FEA500",
        "#E91416"
    ]

    const shuffledColors = [...colors].sort(() => Math.random() - 0.7);
    const targetElem = document.querySelector(`#${targetElement}`) as HTMLElement;

    let colorIndex = 0;
    array.forEach((key: string) => {
        if (targetElem && key) {
            const eachLetter = document.createElement("span");
            eachLetter.textContent = key;
            eachLetter.style.color = shuffledColors[colorIndex] as string;

            colorIndex++;
            targetElem.appendChild(eachLetter);
        } else {
            console.error("Target element or array missing for banner.");
            return;
        }
    });
}
