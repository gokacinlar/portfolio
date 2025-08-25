import { Template } from "../helper";

class Updates extends HTMLElement {
    constructor() {
        super();

        const template = new Template().createTemplate(this.render());
        this.appendChild(template.content.cloneNode(true));
    }

    private render(): string {
        return `
            <section class="container h-100">
                <div id="blogContainer" class="row mb-3 h-100">
                    <div class="bwrapper col-md-4 col-lg-4 col-sm h-100">
                        ${this.blogAside()}
                    </div>
                    <div class="bwrapper col-md-8 col-lg-8 col-sm h-100">
                        <main id="blogMain" class="h-100 rounded-5 px-3 py-3 shadow-sm">
                            <h1>Main Content</h1>
                            <p>This is the main section.</p>
                        </main>
                    </div>
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
            <aside id="blogAside" class="h-100 rounded-5 p-3 shadow-sm">
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
}

customElements.define("app-updates", Updates);