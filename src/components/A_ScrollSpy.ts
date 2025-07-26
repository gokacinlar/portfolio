import { formatDate, validateEmail } from "../helper";
import { loadWeb3Forms, formState } from "../utils/form";
import EmailForm from "./A_EmailForm";
import Accordion from "./A_Accordion";

class ScrollSpy {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            validateEmail(".email-validate");
            document.addEventListener("DOMContentLoaded", () => {
                formState();
                loadWeb3Forms();
            })
        });

        // Bootstrap form validation pattern
        document.querySelectorAll<HTMLFormElement>(".needs-validation").forEach((form) => {
            form.addEventListener("submit", (event) => {
                if (!form.checkValidity()) {
                    event.preventDefault();
                    event.stopPropagation();
                }

                // Bootstrap expects this to trigger feedback styles
                form.classList.add("was-validated");
            });
        });
    }

    public render(): string {
        return `
            <section id="aside-content" class="d-flex flex-column gap-4">
                <div id="about-scroll-spy-id" class="z-0 sticky-top scrollspy-nav list-group d-flex flex-row align-items-center justify-content-between fs-4 fw-medium gap-2 text-truncate">
                    <a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#li-1">🧑 About Me</a>
                    <a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#li-2">📚 Education</a>
                    <a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#li-3">📠 Work</a>
                    <a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#li-4">🚀 Tech Stack & Tools</a>
                    <a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#li-5">📧 E-mail</a>
                    <a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#li-6">🔎 Advanced</a>
                </div>
                <div data-bs-spy="scroll" data-bs-target="#about-scroll-spy-id" data-bs-offset="0" class="scrollspy-content" tabindex="0">
                    <h4 id="li-1">🧑 About Me</h4>
                    <hr class="w-25">
                    <div>
                        <p class="about-li1-text fs-5">
                            I'm highly interested in creating <mark>content-first</mark> websites as well as crafting stand-alone
                            <mark>web applications (SPAs)</mark> or <mark>multi-page</mark> static content where <em>speed</em> &
                            <em>progressive enhancement</em> are critically important.
                        </p>
                        <p class="about-li1-text fs-5">
                            My primary field is teaching English in <mark>ESL (English as a Second Language)</mark> context.
                        </p>
                    </div>
                    <h4 id="li-2">📚 Education</h4>
                    <hr class="w-25">
                    <div class="table-responsive">
                        <table id="eduTable" class="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">Institution</th>
                                    <th scope="col">Field</th>
                                    <th scope="col">Degree</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row">Atatürk University</th>
                                    <td>English Language Teaching</td>
                                    <td>Bachelor's Degree</td>
                                    <td>${formatDate(new Date(2019, 8))} - ${formatDate(new Date(2023, 6))}</td>
                                </tr>
                                <tr>
                                    <th scope="row">Atatürk University</th>
                                    <td>Computer Programming</td>
                                    <td>Associate Degree</td>
                                    <td>${formatDate(new Date(2023, 8))} - current</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h4 id="li-3">📠 Work</h4>
                    <hr class="w-25">
                    <p>You can download or view my CV here.</p>
                    <h4 id="li-4">🚀 Tech Stack & Tools</h4>
                    <hr class="w-25">
                    <div>
                        <div class="table-responsive">
                            <table id="stackTable" class="table table-striped table-bordered">
                                <thead>
                                    <tr>
                                        <th>Category</th>
                                        <th>Technologies</th>
                                        <th>Libraries</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Front-end</td>
                                        <td>JavaScript (ES6+), TypeScript</td>
                                        <td>React, Redux</td>
                                    </tr>
                                    <tr>
                                        <td>Back-end</td>
                                        <td>PHP(7+), Node.js, Express.js</td>
                                        <td>Laravel</td>
                                    </tr>
                                    <tr>
                                        <td>Styling</td>
                                        <td>Bootstrap (+derivatives), SASS, Tailwind CSS, Material UI</td>
                                        <td>Shadcn, DaisyUI</td>
                                    </tr>
                                    <tr>
                                        <td>Databases</td>
                                        <td>MySQL, SQLite, PostgreSQL</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>DevOps</td>
                                        <td>Apache, Docker, Linux (WSL + Native)</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>CMS</td>
                                        <td>Wordpress, Headless Wordpress</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>Tools</td>
                                        <td>Git, Webpack</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>Testing</td>
                                        <td>Mocha, Jest</td>
                                        <td>-</td>
                                    </tr>
                                    <tr>
                                        <td>Design & UX</td>
                                        <td>Figma, Adobe Illustrator, Adobe Photoshop</td>
                                        <td>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <h4 id="li-5">📧 E-mail</h4>
                    <hr class="w-25">
                    ${new EmailForm().render()}
                    <h4 id="li-6">🔎 Advanced</h4>
                    <hr class="w-25">
                    ${new Accordion().render()}
                    </div>
                </div>
            </section>
        `;
    }
}

export default ScrollSpy;