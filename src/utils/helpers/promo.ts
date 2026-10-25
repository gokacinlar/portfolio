import DOMPurify from "dompurify";

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

    public bindVerticalTabEventsAndautoCycleTabs(data: Object): () => void {
        const buttons = Array.from(document.querySelectorAll(".promo-desc-tab-group-btn")) as HTMLButtonElement[];
        if (!buttons.length) {
            return () => { };
        }

        let index: number = 0;
        const duration: number = 5000;
        let activeInterval: ReturnType<typeof setInterval> | null = null;
        const clickHandlers: Array<{ btn: HTMLButtonElement; handler: () => void }> = [];

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
                    const nextButton = buttons[index] as HTMLButtonElement;
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
            const handler = () => {
                index = i;
                const type = btn.getAttribute("data-type");
                if (type) {
                    this.createVerticalTabContent(type, data);
                    startProgressForButton(btn);
                    scrollToActiveTab(btn);
                }
            };
            btn.addEventListener("click", handler);
            clickHandlers.push({ btn, handler });
        });

        // Auto-start from the first tab
        if (buttons.length > 0) {
            const firstButton = buttons[index];
            if (!firstButton) return () => { };
            const initialType = firstButton.getAttribute("data-type");
            if (initialType) {
                this.createVerticalTabContent(initialType, data);
                scrollToActiveTab(firstButton);
                startProgressForButton(firstButton);
            }
        }

        return () => {
            if (activeInterval) {
                clearInterval(activeInterval);
                activeInterval = null;
            }
            clickHandlers.forEach(({ btn, handler }) => {
                btn.removeEventListener("click", handler);
            });
            clearAllProgressBars();
        };
    }
}
