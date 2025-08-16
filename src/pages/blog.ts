import DOMPurify from "dompurify";
import ListXPosts from "../utils/xPosts";
import { Template } from "../helper";

class Updates extends HTMLElement {
    constructor() {
        super();

        const template = new Template().createTemplate(this.render());
        this.appendChild(template.content.cloneNode(true));

        // Init timeline fetching from X
        document.addEventListener("DOMContentLoaded", () => {
            new ListXPosts("blogMain", "devDissentNT");
        });
        // this.fetchAndRenderContent();
    }

    private render(): string {
        return `
            <section class="container h-100">
                <div id="blogContainer" class="row g-3 h-100"> <!-- Added g-3 for gutter -->
                    ${this.blogAside()}
                    <main id="blogMain" class="col-xs-12 col-md-8 col-lg-9 col-sm rounded-5 px-3 py-3 shadow-sm">
                        <h1>Main Content</h1>
                        <p>This is the main section.</p>
                    </main>
                </div>
            </section>
        `;
    }

    private blogAsideTab(): string {
        return `
            <ul class="nav nav-pills nav-fill gap-2 mb-3" id="blogAsideTabGroup" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="btn btn-lg nav-link rounded-pill shadow-sm fs-5 fw-medium active" aria-current="page" data-bs-toggle="pill" data-bs-target="#updates" type="button" role="tab" aria-controls="pills-contact" aria-selected="true">Updates</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="btn btn-lg nav-link rounded-pill shadow-sm fs-5 fw-medium" data-bs-toggle="pill" data-bs-target="#writings" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Writings</button>
                </li>
            </ul>
        `;
    }

    private blogAside(): string {
        return `
            <aside id="blogAside" class="col-xs-12 col-md-4 col-lg-3 col-sm rounded-5 px-3 py-3 shadow-sm">
                ${this.blogAsideTab()}
                <section id="blogAsideChild" class="rounded-5 h-75 px-3 py-3 border border-1 border-dark-subtle">
                    <div class="tab-content" id="pills-tabContent">
                        <div class="tab-pane fade show active" id="updates" role="tabpanel" aria-labelledby="updates">-</div>
                        <div class="tab-pane fade" id="writings" role="tabpanel" aria-labelledby="writings">-</div>
                    </div>
                </section>
            </aside>
        `;
    }

    private offCanvas(): string {
        return `
            <div class="offcanvas offcanvas-start" tabindex="-1" id="blogAsideOffcanvasTemplate" aria-labelledby="blogAsideOffcanvas">
                <div class="offcanvas-header">
                    <h5 class="offcanvas-title" id="blogAsideOffcanvas">Latest updates</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div class="offcanvas-body">
                    <div>
                        Some text as placeholder. In real life you can have the elements you have chosen. Like, text, images, lists, etc.
                    </div>
                </div>
            </div>
        `;
    }

    private async fetchAndRenderContent(): Promise<void> {
        const types: Array<string> = ["update", "writing"];
        for (const type of types) {
            try {
                const response = await fetch(`../php/init.php?type=${type}`);
                if (!response.ok) {
                    throw new Error("Network error.");
                } else {
                    const data = await response.json();

                    const tab = this.querySelector(`#${type}s`);
                    if (tab) {
                        tab.innerHTML = DOMPurify.sanitize(this.renderContent(data));
                    }
                }
            } catch (error: unknown) {
                console.error(`Error fetching ${type}s:`, error);
                const tab = this.querySelector(`#${type}s`);
                if (tab) {
                    tab.innerHTML = DOMPurify.sanitize(`<p class="text-danger">Failed to load ${type}s.</p>`);
                }
            }
        }
    }

    // Render the received content from init.php in aside
    private renderContent(data: any[]): string {
        if (!data.length) {
            return "<p>No content available.</p>";
        } else {
            return `
            <ul class="list-group">
                ${data.map(item => `
                    <li class="list-group-item">
                        <h5>${item.title}</h5>
                        <p>${item.body}</p>
                        <small>By ${item.author} on ${item.date}</small>
                    </li>
                `).join("")}
            </ul>
        `;
        }
    }
}

customElements.define("app-updates", Updates);