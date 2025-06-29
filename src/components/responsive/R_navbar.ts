import { HeaderNode } from "../../pages/header";

class ResponsiveNavbar extends HTMLElement {
    public responsiveMenuToggleButton(): string {
        return `
            <button id="responsiveMenuToggleBtn" type="button" class="header-responsive-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-md
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
            <div id="responsiveNavbar" class="position relative" data-type="closed">
                <nav id="headerRM" class="rounded-4 shadow">
                    <ul class="header-middle-nav-links list-unstyled mb-0 d-flex flex-column align-items-center gap-1">
                        ${new HeaderNode().headerMiddleContent()}
                    </ul>
                </nav>
            </div>
        `;
    }

    connectedCallback(): void {
        const responsiveMenuToggleBtn = document.querySelector("#responsiveMenuToggleBtn") as HTMLButtonElement;
        const responsiveMenuToggleBtnIcon = document.querySelector("#responsiveMenuToggleBtn > i") as HTMLIFrameElement;
        const responsiveNavbar = document.querySelector("#responsiveNavbar") as HTMLDivElement;
        let isClicked: boolean = false;

        // Hide the navbar first
        const dataType = responsiveNavbar.getAttribute("data-type");
        if (dataType === "closed") {
            responsiveNavbar.style.display = "none";
        }

        // Toggle button logic
        responsiveMenuToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Say no to document click
            isClicked = !isClicked;
            if (isClicked) {
                responsiveNavbar.style.display = "block";
                responsiveNavbar.setAttribute("data-type", "open");
                changeMenuIconOnClick(responsiveMenuToggleBtnIcon, "bi-three-dots", "bi-three-dots-vertical");
            } else {
                responsiveNavbar.style.display = "none";
                responsiveNavbar.setAttribute("data-type", "closed");
                changeMenuIconOnClick(responsiveMenuToggleBtnIcon, "bi-three-dots-vertical", "bi-three-dots");
            }
        });

        const changeMenuIconOnClick = (target: HTMLIFrameElement, oldData: string, data: string) => {
            target.classList.remove(oldData);
            target.classList.add(data);
        }

        // Additional implementation of closing the navbar menu when its clicked outside
        document.addEventListener("click", (e: MouseEvent) => {
            const target = e.target as Node;
            if (!responsiveNavbar.contains(target) && !responsiveMenuToggleBtn.contains(target)) {
                responsiveNavbar.style.display = "none";
                responsiveNavbar.setAttribute("data-type", "closed");
                isClicked = false;
            }
        });
    }
}

export default ResponsiveNavbar;
customElements.define("app-responsive-navbar", ResponsiveNavbar);