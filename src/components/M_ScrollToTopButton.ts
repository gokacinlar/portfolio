import BaseComponent from "../utils/helpers/baseComponent";
import Localize from "../utils/initLocalization";

class ScrollToTopButton extends BaseComponent {
	private _isVisible: boolean = false;
	private _isArrowFilled: boolean = false;
	private arrowTimeoutId: ReturnType<typeof setTimeout> | null = null;

	private upArrowClickHandler: ((e: MouseEvent) => void) | null = null;

	private static readonly TOP_VAL: number = 0;
	private static readonly SCROLL_Y_VAL: number = 500;

	constructor() {
		super();
		this.className =
			"scroll-to-top-div rounded-pill slide-from-right shadow-lg";
	}

	private content(): string {
		return /*html*/ `
            <div class="btn-warning text-black bg-gradient d-flex flex-row align-items-center justify-content-center gap-2 p-2 fw-medium rounded-5">
                <i class="bi bi-arrow-up-circle fs-4 fw-medium"></i>
                <span>${Localize.translate("common:scrollToTop:text")}</span>
            </div>
        `;
	}

	private handleUpArrowChange() {
		const upArrow =
			(this.querySelector(".bi-arrow-up-circle") as HTMLElement) ||
			(document.querySelector(".bi-arrow-up-circle") as HTMLElement);

		if (!upArrow) return;

		if (this.upArrowClickHandler) {
			this.removeEventListener("click", this.upArrowClickHandler);
		}

		this.upArrowClickHandler = () => {
			if (!this._isArrowFilled) {
				upArrow.classList.remove("bi-arrow-up-circle");
				upArrow.classList.add("bi-arrow-up-circle-fill");
				this._isArrowFilled = true;

				if (this.arrowTimeoutId) {
					clearTimeout(this.arrowTimeoutId);
				}
				this.arrowTimeoutId = setTimeout(() => {
					upArrow.classList.remove("bi-arrow-up-circle-fill");
					upArrow.classList.add("bi-arrow-up-circle");
					this._isArrowFilled = false;
					this.arrowTimeoutId = null;
				}, 500);
			}
		};

		this.addEventListener("click", this.upArrowClickHandler);
	}

	private toggleVisibility = (): void => {
		this._isVisible = window.scrollY > ScrollToTopButton.SCROLL_Y_VAL;
		this.style.display = this._isVisible ? "block" : "none";

		if (
			window.scrollY + window.innerHeight >=
			document.documentElement.scrollHeight
		) {
			this.style.display = "none";
		}

		this.handleHidingOnFooter();
	};

	private scrollToTop = (): void => {
		const prefersReducedMotion = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;

		if (prefersReducedMotion) {
			this.classList.remove("slide-from-right");
		}

		window.scrollTo({
			top: ScrollToTopButton.TOP_VAL,
			behavior: prefersReducedMotion ? "instant" : "smooth",
		});
	};

	private handleHidingOnFooter(): void {
		if (
			window.scrollY + window.innerHeight >=
			document.documentElement.scrollHeight
		) {
			this.style.display = "none";
		}
	}

	render(): string {
		return this.content();
	}

	connectedCallback(): void {
		super.connectedCallback();
		this.addEventListener("click", this.scrollToTop);
		this.handleUpArrowChange();
		window.addEventListener("scroll", this.toggleVisibility, { passive: true });
		this.toggleVisibility();
	}

	disconnectedCallback(): void {
		window.removeEventListener("scroll", this.toggleVisibility);
		this.removeEventListener("click", this.scrollToTop);
		if (this.upArrowClickHandler) {
			this.removeEventListener("click", this.upArrowClickHandler);
			this.upArrowClickHandler = null;
		}
		if (this.arrowTimeoutId) {
			clearTimeout(this.arrowTimeoutId);
			this.arrowTimeoutId = null;
		}
	}
}

customElements.define("scroll-to-top-button", ScrollToTopButton);
export default ScrollToTopButton;
