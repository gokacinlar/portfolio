import { HeaderNode } from "../../pages/header";

interface ToggleElements {
    target: HTMLButtonElement;
    navbar: HTMLDivElement;
    icon: HTMLElement;
}

class ResponsiveNavbar {
    private static isClicked = false;
    private documentClickHandler?: (e: MouseEvent) => void;

    public responsiveMenuToggleButton(): string {
        return `
            <button id="responsiveMenuToggleBtn" type="button" class="header-responsive-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm
                d-flex flex-row align-items-center gap-1" title="Change Day/Night Mode">
                <i class="bi bi-three-dots"></i>
            </button>
            <div class="responsive-navbar-container">
                ${this.render()}
            </div>
        `;
    }

    public render(): string {
        return `
        <div id="responsiveNavbar" class="position-relative" data-type="closed">
            <nav id="headerRM" class="rounded-5 mt-2 shadow" >
                <div class="py-2 px-2">
                    ${new HeaderNode().headerLeftIcon()}
                </div>
                <ul class="header-middle-nav-links list-unstyled mb-0 d-flex flex-column align-items-center gap-1 bg-gradient p-2">
                    ${new HeaderNode().headerMiddleContent()}
                </ul>
            </nav>
        </div>
    `;
    }

    private changeMenuIconOnClick = (target: HTMLElement, oldData: string, data: string) => {
        target.classList.remove(oldData);
        target.classList.add(data);
    }

    private handleMenuToggleState({ target, navbar, icon }: ToggleElements): void {
        target.addEventListener("click", (e) => {
            e.stopPropagation();

            ResponsiveNavbar.isClicked = !ResponsiveNavbar.isClicked;

            if (ResponsiveNavbar.isClicked) {
                navbar.style.display = "block";
                navbar.setAttribute("data-type", "open");
                this.changeMenuIconOnClick(icon, "bi-three-dots", "bi-three-dots-vertical");
            } else {
                navbar.style.display = "none";
                navbar.setAttribute("data-type", "closed");
                this.changeMenuIconOnClick(icon, "bi-three-dots-vertical", "bi-three-dots");
            }
        });
    }

    connectedCallback(): void {
        const responsiveMenuToggleBtn = document.querySelector("#responsiveMenuToggleBtn") as HTMLButtonElement;
        const responsiveMenuToggleBtnIcon = document.querySelector("#responsiveMenuToggleBtn > i") as HTMLElement;
        const responsiveNavbar = document.querySelector("#responsiveNavbar") as HTMLDivElement;

        // Hide the navbar first
        const dataType = responsiveNavbar.getAttribute("data-type");
        if (dataType === "closed") {
            responsiveNavbar.style.display = "none";
        }

        this.handleMenuToggleState({
            target: responsiveMenuToggleBtn,
            navbar: responsiveNavbar,
            icon: responsiveMenuToggleBtnIcon
        });

        // Additional implementation of closing the navbar menu when clicked outside
        this.documentClickHandler = (e: MouseEvent) => {
            const target = e.target as Node;
            if (!responsiveNavbar.contains(target) && !responsiveMenuToggleBtn.contains(target)) {
                responsiveNavbar.style.display = "none";
                responsiveNavbar.setAttribute("data-type", "closed");
                ResponsiveNavbar.isClicked = false;

                // Update icon when closing via outside click
                this.changeMenuIconOnClick(responsiveMenuToggleBtnIcon, "bi-three-dots-vertical", "bi-three-dots");
            }
        };

        document.addEventListener("click", this.documentClickHandler);
    }

    disconnectedCallback(): void {
        // Clean up event listener when component is removed
        if (this.documentClickHandler) {
            document.removeEventListener("click", this.documentClickHandler);
        }
    }
}

export default ResponsiveNavbar;