import { loadWeb3Forms, formState } from "../utils/form";
import { addBackgroundBasedOnVerticalScroll } from "../utils/helper";
import { AboutData } from "../static";
import { renderEmailForm } from "./A_EmailForm";
import Accordion from "./A_Accordion";
import * as Type from "../ts/types/types";
import Localize from "../utils/initLocalization";

class ScrollSpy {
    private bgCleanup: (() => void) | null = null;
    private domReadyBgHandler: (() => void) | null = null;
    private formSubmitHandlers: Array<{ form: HTMLFormElement; handler: (event: Event) => void }> = [];
    private web3FormsTimeoutId: ReturnType<typeof setTimeout> | null = null;

    private renderHeading(id: string, text: string): string {
        return /*html*/ `
            <h4 id="${id}">
                <a href="#${id}" class="link-body-emphasis link-offset-2 link-underline link-underline-opacity-0 link-underline-opacity-75-hover">
                    ${text}
                </a>
            </h4>
        `;
    }

    // Scrollspy list items
    private renderNavLinks() {
        return AboutData.navLinks.map(({ id, icon, label }) =>
            `<a class="list-group-item list-group-item-action rounded-pill shadow-sm text-center" href="#${id}">${icon} ${label}</a>`
        ).join("");
    }

    private renderTable(headers: string[], rows: Type.TableRow[], id: string): string {
        return /*html*/ `
            <div class="table-responsive">
                <table id="${id}" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            ${headers.map((h) => `<th scope="col">${h}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((row) => `<tr>${row.map((cell, i) => i === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join("")}</tr>`).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    public render(): string {
        return /*html*/ `
            <section id="aside-content" class="aside-main d-flex flex-column gap-4">
                <div id="about-scroll-spy-id" class="z-0 sticky-top scrollspy-nav list-group d-flex flex-row align-items-center justify-content-between fs-4 fw-medium gap-2 text-truncate rounded-pill">
                    ${this.renderNavLinks()}
                </div>
                <div class="scrollspy-content" data-bs-spy="scroll" data-bs-target="#about-scroll-spy-id" data-bs-offset="40" data-bs-smooth-scroll="true" tabindex="0">
                    <div>
                        <div>
                            ${this.renderHeading("aboutMe", `🧑 ${Localize.translate("common:about:nav:aboutMe")}`)}
                            <hr class="w-25">
                        </div>
                        <div>
                            <p class="about-li1-text fs-5 fw-medium">
                                ${Localize.translate("common:about:introduction:first")}
                            </p>
                            <p class="about-li1-text fs-5 fw-medium">
                                ${Localize.translate("common:about:introduction:last")}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div>
                            ${this.renderHeading("education", `📚 ${Localize.translate("common:about:nav:education")}`)}
                            <hr class="w-25">
                        </div>
                        ${this.renderTable([
            Localize.translate("common:about:table:institution"),
            Localize.translate("common:about:table:field"),
            Localize.translate("common:about:table:degree"),
            Localize.translate("common:about:table:date")
        ], AboutData.educationRows, "eduTable")}
                    </div>
                    <div>
                        <div>
                            ${this.renderHeading("work", `📠 ${Localize.translate("common:about:nav:work")}`)}
                            <hr class="w-25">
                        </div>
                        <div>
                            <p class="fs-5 fw-medium d-flex flex-row align-items-center gap-1 text-break">
                                <span>
                                    ${Localize.translate("common:about:work:cvIntro")}
                                    <a class="link-info link-opacity-75-hover link-offset-2 modal-trigger" data-modal="requestCVModal" href="#" title="${Localize.translate("common:about:work:cvTitle")}">
                                        ${Localize.translate("common:about:work:cvHere")}
                                    </a>
                                </span> 
                            </p>
                        </div>
                    </div>
                    <div>
                        <div>
                            ${this.renderHeading("stack", `🚀 ${Localize.translate("common:about:nav:stack")}`)}
                            <hr class="w-25">
                        </div>
                        <div>
                            ${this.renderTable([
            Localize.translate("common:about:table:category"),
            Localize.translate("common:about:table:technologies"),
            Localize.translate("common:about:table:librariesTools")
        ], AboutData.stackRows, "stackTable")}
                        </div>
                    </div>
                    <div>
                        <div>
                            ${this.renderHeading("mailing", `📧 ${Localize.translate("common:about:nav:mailing")}`)}
                            <hr class="w-25">
                        </div>
                        <div>
                            ${renderEmailForm()}
                        </div>
                    </div>
                    <div>
                        <div>
                            ${this.renderHeading("advanced", `🔎 ${Localize.translate("common:about:nav:advanced")}`)}
                            <hr class="w-25">
                        </div>
                        <div>
                            ${new Accordion().render()}
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    private initWeb3Forms(): void {
        this.web3FormsTimeoutId = setTimeout(() => {
            loadWeb3Forms().then(() => {
                formState();
            });
        }, 0);

        // Email validation - track handlers for cleanup
        document.querySelectorAll<HTMLFormElement>(".needs-validation").forEach((form) => {
            const handler = (event: Event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            };
            form.addEventListener("submit", handler);
            this.formSubmitHandlers.push({ form, handler });
        });
    }

    connectedCallback(): void {
        this.initWeb3Forms();

        const attachBg = () => {
            this.bgCleanup = addBackgroundBasedOnVerticalScroll("about-main", "about-scroll-spy-id", "glow-white-drop-shadow");
        };

        this.domReadyBgHandler = () => {
            attachBg();
            if (this.domReadyBgHandler) {
                document.removeEventListener("DOMContentLoaded", this.domReadyBgHandler);
                this.domReadyBgHandler = null;
            }
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.domReadyBgHandler);
        } else {
            attachBg();
        }
    }

    disconnectedCallback(): void {
        if (this.web3FormsTimeoutId !== null) {
            clearTimeout(this.web3FormsTimeoutId);
            this.web3FormsTimeoutId = null;
        }
        this.formSubmitHandlers.forEach(({ form, handler }) => {
            form.removeEventListener("submit", handler);
        });
        this.formSubmitHandlers = [];
        if (this.bgCleanup) {
            this.bgCleanup();
            this.bgCleanup = null;
        }
        if (this.domReadyBgHandler) {
            document.removeEventListener("DOMContentLoaded", this.domReadyBgHandler);
            this.domReadyBgHandler = null;
        }
    }
}

export default ScrollSpy;