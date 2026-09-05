import { HeaderNode } from "../../pages/header";
import Localize from "../../utils/initLocalization";

interface ResponsiveNavBarElements {
    title: string;
    icon: string;
    href: string;
}

class ResponsiveNavbar {
    private static readonly isOffcanvasScrollable: boolean = false;
    private static readonly NAVBAR_HEADER_LINKS: ResponsiveNavBarElements[] = [
        {
            title: Localize.translate("common:misc:github"),
            icon: "bi bi-github",
            href: "https://www.github.com/gokacinlar",
        },
    ];

    private offcanvas?: HTMLElement;
    private toggleButton?: HTMLButtonElement;
    private toggleButtonIcon?: HTMLElement;

    private handleOffcanvasShown = (): void => {
        this.setMenuIcon("bi-three-dots-vertical");
    };

    private handleOffcanvasHidden = (): void => {
        this.setMenuIcon("bi-three-dots");
    };

    public responsiveMenuToggleButton(): string {
        return /* html */ `
            <button
                id="responsiveMenuToggleBtn"
                type="button"
                class="header-responsive-btn bee-color-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm
                    d-flex flex-row align-items-center gap-1"
                title="${Localize.translate("common:header:dayNight")}"
                aria-controls="responsiveHeaderOffcanvas"
                aria-label="${Localize.translate("common:header:dayNight")}"
                data-bs-toggle="offcanvas"
                data-bs-target="#responsiveHeaderOffcanvas"
                aria-expanded="false"
            >
                <i class="bi bi-three-dots"></i>
            </button>
            <div class="responsive-navbar-container">
                ${this.renderResponsiveNavbar()}
            </div>
        `;
    }

    public renderResponsiveNavbar(): string {
        return /* html */ `
            <div
                class="offcanvas offcanvas-end rounded-start-4"
                tabindex="-1"
                id="responsiveHeaderOffcanvas"
                aria-labelledby="responsiveHeaderOffcanvasTitle"
                data-bs-scroll="${ResponsiveNavbar.isOffcanvasScrollable}"
                data-bs-backdrop="true"
            >
                <div class="offcanvas-header bg-secondary-subtle rounded-start-4">
                    <div class="d-flex flex-wrap align-items-center justify-content-center gap-2">
                        <div>
                            ${HeaderNode.headerLeftIcon()}
                        </div>
                        <h5 class="offcanvas-title" id="responsiveHeaderOffcanvasTitle">
                            Derviş Öksüzoğlu
                        </h5>
                    </div>
                    <button
                        id="dismissOffcanvasBtn" type="button" class="btn btn-sm btn-close fs-5 fw-bold"
                        data-bs-dismiss="offcanvas" aria-label="${Localize.translate("common:misc:close")}">
                    </button>
                </div>
                <div id="responsiveHeaderOffCanvasArea" class="offcanvas-body py-1 px-1 mx-0 my-0 overflow-hidden" >
                    <nav id="headerRM" class="h-100 rounded-5 mt-2 shadow-sm d-flex flex-column justify-content-between">
                        <div>
                            <ul class="list-unstyled mb-0 d-flex flex-column align-items-center gap-1 p-2">
                                ${HeaderNode.headerMiddleContent()}
                            </ul>
                        </div>

                        <div>
                            <div class="border-1 border-secondary-subtle border-bottom py-2 px-2 d-flex flex-row align-items-center justify-content-between">
                                <div class="d-flex flex-row align-items-center justify-content-center px-2 gap-3">
                                    ${this.renderNavbarHeaderContent()}
                                </div>
                            </div>
                            <div class="mt-4 mb-2">
                                <blockquote class="blockquote text-center text-secondary">
                                    <p>
                                        <em>
                                            ${Localize.translate("common:misc:motto")}
                                        </em>
                                    </p>
                                </blockquote>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        `;
    }

    private renderNavbarHeaderContent(): string {
        return ResponsiveNavbar.NAVBAR_HEADER_LINKS
            .map(
                ({ title, icon, href }) => /* html */ `
                    <a
                        href="${href}"
                        hreflang="x-default"
                        title="${title}"
                        class="link-offset-2 link-underline link-underline-opacity-0
                            display-2 text-secondary"
                    >
                        <i class="${icon}"></i>
                    </a>
                `,
            )
            .join("");
    }

    private setMenuIcon(iconName: string): void {
        if (!this.toggleButtonIcon) {
            return;
        }

        this.toggleButtonIcon.classList.remove("bi-three-dots", "bi-three-dots-vertical");
        this.toggleButtonIcon.classList.add(iconName);
    }

    connectedCallback(): void {
        this.toggleButton = document.querySelector("#responsiveMenuToggleBtn") as HTMLButtonElement;
        this.toggleButtonIcon = document.querySelector("#responsiveMenuToggleBtn > i") as HTMLElement;
        this.offcanvas = document.querySelector("#responsiveHeaderOffcanvas") as HTMLElement;

        if (!this.toggleButton || !this.toggleButtonIcon || !this.offcanvas) {
            console.warn("Responsive navbar elements were not found.");
            return;
        }

        this.offcanvas.addEventListener("shown.bs.offcanvas", this.handleOffcanvasShown);
        this.offcanvas.addEventListener("hidden.bs.offcanvas", this.handleOffcanvasHidden);
    }

    disconnectedCallback(): void {
        if (!this.offcanvas) {
            return;
        }

        this.offcanvas.removeEventListener("shown.bs.offcanvas", this.handleOffcanvasShown);
        this.offcanvas.removeEventListener("hidden.bs.offcanvas", this.handleOffcanvasHidden);
    }
}

export default ResponsiveNavbar;