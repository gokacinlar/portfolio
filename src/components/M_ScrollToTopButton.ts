class ScrollToTopButton extends HTMLElement {
    private _isVisible: boolean = false;
    private _isArrowFilled: boolean = false;
    private static readonly TOP_VAL: number = 0;
    private static readonly SCROLL_Y_VAL: number = 500;

    constructor() {
        super();

        this.className = "scroll-to-top-div rounded-pill slide-from-right shadow-lg";
        this.innerHTML = this.content();
        this.addEventListener("click", this.scrollToTop);
        this.handleUpArrowChange();
        window.addEventListener("scroll", this.toggleVisibility);
    }

    private content(): string {
        return `
            <div class="btn-warning text-black bg-gradient d-flex flex-row align-items-center justify-content-center gap-2 p-2 fw-medium rounded-5">
                <i class="bi bi-arrow-up-circle fs-4 fw-medium"></i>
                <span>Scroll to Top</span>
            </div>
        `;
    }

    private handleUpArrowChange() {
        const upArrow = document.querySelector(".bi-arrow-up-circle") as HTMLElement;
        if (upArrow) {
            try {
                this.addEventListener("click", () => {
                    if (!this._isArrowFilled) {
                        upArrow.classList.remove("bi-arrow-up-circle");
                        upArrow.classList.add("bi-arrow-up-circle-fill");
                        this._isArrowFilled = true;

                        setTimeout(() => {
                            upArrow.classList.remove("bi-arrow-up-circle-fill");
                            upArrow.classList.add("bi-arrow-up-circle");
                            this._isArrowFilled = false;
                        }, 500);
                    }
                });
            } catch (error: unknown) {
                throw new Error("Something bad happened: " + error);
            }
        }
    }

    private toggleVisibility = (): void => {
        this._isVisible = window.scrollY > ScrollToTopButton.SCROLL_Y_VAL;
        this.style.display = this._isVisible ? "block" : "none";
    }

    private scrollToTop = (): void => {
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReducedMotion) {
            this.classList.remove("slide-from-right");
        }

        window.scrollTo({
            top: ScrollToTopButton.TOP_VAL,
            behavior: prefersReducedMotion ? "instant" : "smooth",
        });
    }

    connectedCallback(): void {
        this.toggleVisibility();
    }

    disconnectedCallback(): void {
        window.removeEventListener("scroll", this.toggleVisibility);
    }
}

customElements.define("scroll-to-top-button", ScrollToTopButton);
export default ScrollToTopButton;