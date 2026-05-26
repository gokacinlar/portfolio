import { loadWeb3Forms, formState } from "../utils/form";
import { addBackgroundBasedOnVerticalScroll } from "../utils/helper";
import { AboutData } from "../static";
import { renderEmailForm } from "./A_EmailForm";
import Accordion from "./A_Accordion";
import * as Type from "../ts/types/types";

class ScrollSpy {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            addBackgroundBasedOnVerticalScroll("about-main", "about-scroll-spy-id", "glow-white-drop-shadow");
        });
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
                            <h4 id="aboutMe">🧑 About Me</h4>
                            <hr class="w-25">
                        </div>
                        <div>
                            <p class="about-li1-text fs-5 fw-medium">
                                ${AboutData.introduction.first}
                            </p>
                            <p class="about-li1-text fs-5 fw-medium">
                                ${AboutData.introduction.last}
                            </p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4 id="education">📚 Education</h4>
                            <hr class="w-25">
                        </div>
                        ${this.renderTable(["Institution", "Field", "Degree", "Date"], AboutData.educationRows, "eduTable")}
                    </div>
                    <div>
                        <div>
                            <h4 id="work">📠 Work</h4>
                            <hr class="w-25">
                        </div>
                        <div>
                            <p class="fs-5 fw-medium d-flex flex-row align-items-center gap-1">You can download or view my CV <a class="link-info link-opacity-75-hover link-offset-2 modal-trigger" data-modal="requestCVModal" href="#" title="See/Download CV here.">here.</a></p>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4 id="stack">🚀 Tech Stack & Tools</h4>
                            <hr class="w-25">
                        </div>
                        <div>
                            ${this.renderTable(["Category", "Technologies", "Libraries & Tools"], AboutData.stackRows, "stackTable")}
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4 id="mailing">📧 E-mail</h4>
                            <hr class="w-25">
                        </div>
                        <div>
                            ${renderEmailForm()}
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4 id="advanced">🔎 Advanced</h4>
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

    private static initWeb3Forms() {
        setTimeout(() => {
            loadWeb3Forms().then(() => {
                formState();
            });
        }, 0);

        // Email validation
        document.querySelectorAll<HTMLFormElement>(".needs-validation").forEach((form) => {
            form.addEventListener("submit", (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add("was-validated");
            });
        });
    }

    connectedCallback(): void {
        ScrollSpy.initWeb3Forms();
    }
}

export default ScrollSpy;