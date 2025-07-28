import { formatDate, validateEmail } from "../helper";
import { loadWeb3Forms, formState } from "../utils/form";
import EmailForm from "./A_EmailForm";
import Accordion from "./A_Accordion";

type NavLink = { id: string; icon: string; label: string };
type TableRow = string[];

class ScrollSpy {
    private navLinks: NavLink[] = [
        { id: "li-1", icon: "🧑", label: "About Me" },
        { id: "li-2", icon: "📚", label: "Education" },
        { id: "li-3", icon: "📠", label: "Work" },
        { id: "li-4", icon: "🚀", label: "Tech Stack & Tools" },
        { id: "li-5", icon: "📧", label: "E-mail" },
        { id: "li-6", icon: "🔎", label: "Advanced" },
    ];

    private educationRows: TableRow[] = [
        [
            "Atatürk University",
            "English Language Teaching",
            "Bachelor's Degree",
            `${formatDate(new Date(2019, 8))} - ${formatDate(new Date(2023, 6))}`,
        ],
        [
            "Atatürk University",
            "Computer Programming",
            "Associate Degree",
            `${formatDate(new Date(2023, 8))} - current`,
        ],
    ];

    private stackRows: TableRow[] = [
        ["Front-end", "JavaScript (ES6+), TypeScript", "React, Redux"],
        ["Back-end", "PHP(7+), Node.js, Express.js", "Laravel"],
        ["Styling", "Bootstrap (+derivatives), SASS, Tailwind CSS", "Shadcn, DaisyUI & MaterialUI"],
        ["Databases", "MySQL, SQLite, PostgreSQL (PG preffered)", "-"],
        ["DevOps", "Apache, Docker, Linux (WSL + Native[Ubuntu])", "-"],
        ["CMS", "Wordpress, Headless Wordpress", "-"],
        ["Tools", "Git, Webpack", "-"],
        ["Testing", "Mocha, Jest & Playwright", "-"],
        ["Design & UX", "Figma, Adobe Illustrator, Adobe Photoshop", "-"],
    ];

    constructor() {
        // Email input validator
        document.addEventListener("DOMContentLoaded", () => {
            validateEmail(".email-validate");
            document.addEventListener("DOMContentLoaded", () => {
                formState();
                loadWeb3Forms();
            });
        });

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

    // Scrol
    private renderNavLinks() {
        return this.navLinks.map(({ id, icon, label }) =>
            `<a class="list-group-item list-group-item-action rounded-pill shadow-sm" href="#${id}">${icon} ${label}</a>`
        ).join("");
    }

    private renderTable(headers: string[], rows: TableRow[], id: string) {
        return `
            <div class="table-responsive">
                <table id="${id}" class="table table-striped table-bordered">
                    <thead>
                        <tr>
                            ${headers.map((h) => `<th scope="col">${h}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map((row) =>
            `<tr>${row.map((cell, i) =>
                i === 0
                    ? `<th scope="row">${cell}</th>`
                    : `<td>${cell}</td>`
            ).join("")}</tr>`
        ).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    public render(): string {
        return `
            <section id="aside-content" class="d-flex flex-column gap-4">
                <div id="about-scroll-spy-id" class="z-0 sticky-top scrollspy-nav list-group d-flex flex-row align-items-center justify-content-between fs-4 fw-medium gap-2 text-truncate">
                    ${this.renderNavLinks()}
                </div>
                <div data-bs-spy="scroll" data-bs-target="#about-scroll-spy-id" data-bs-offset="0" class="scrollspy-content" tabindex="0">
                    <h4 id="li-1">🧑 About Me</h4>
                    <hr class="w-25">
                    <div>
                        <p class="about-li1-text fs-5 fw-medium">
                            I'm highly interested in creating <mark>content-first</mark> websites as well as crafting stand-alone
                            <mark>web applications (SPAs)</mark> or <mark>multi-page</mark> static content where <em>speed</em> &amp;
                            <em>progressive enhancement</em> are critically important. I love building user interfaces with mainly
                            <strong>React.</strong>
                        </p>
                        <p class="about-li1-text fs-5 fw-medium">
                            My primary field is teaching English in <mark>ESL (English as a Second Language)</mark> context. My main
                            focus is to maximize practical usage of English in almost every aspect related to casual or academical
                            way of interacting with the language.
                        </p>
                    </div>
                    <h4 id="li-2">📚 Education</h4>
                    <hr class="w-25">
                    ${this.renderTable(["Institution", "Field", "Degree", "Date"], this.educationRows, "eduTable")}
                    <h4 id="li-3">📠 Work</h4>
                    <hr class="w-25">
                        <p class="fs-5 fw-medium">You can download or view my CV here.</p>
                    <h4 id="li-4">🚀 Tech Stack & Tools</h4>
                    <hr class="w-25">
                    ${this.renderTable(
            ["Category", "Technologies", "Libraries"],
            this.stackRows,
            "stackTable"
        )}
                    <h4 id="li-5">📧 E-mail</h4>
                    <hr class="w-25">
                    ${new EmailForm().render()}
                    <h4 id="li-6">🔎 Advanced</h4>
                    <hr class="w-25">
                    ${new Accordion().render()}
                </div>
            </section>
        `;
    }
}

export default ScrollSpy;