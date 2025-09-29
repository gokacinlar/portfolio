import { Template } from "../helper";

class WorkPage extends HTMLElement {
    private vantaEffect: any = null;

    constructor() {
        super();

        const template = new Template().createTemplate(this.render());
        this.appendChild(template.content.cloneNode(true));
    }

    private render(): string {
        return `
            <section id="mainWork">
                <div class="container text-center h-100">
                    <div class="row gy-2 gx-2 align-items-center h-100">
                        <div class="col-xs-12 col-sm-12 col-md-6">
                            <h1 class="display-1 text-start fw-medium pe-none"><mark class="px-4 py-1 rounded-end-5">Hire me</mark> or see my plans <span class="wavy-text">below.</span></h1>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6">
                            <button id="workScrollDownBtn" class="btn btn-lg rounded-5 shadow-sm fw-medium fs-2 mx-auto d-flex flex-row align-items-center justify-content-center gap-2"
                            title="Scroll down" type="button">
                                <span class="work-scroll-down-indicator">See plans</span>
                                <i class="work-scroll-down-icon bi bi-arrow-down-circle-fill fs-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            <article id="buyOptions" class="px-2 py-2 mx-2 my-2 rounded-5 h-100">
                ${this.optionsContainer()}
            </article>
        `;
    }

    private optionsContainer(): string {
        return `
            <section id="buyOptions">
                <div>
                    ${this.navigate()}
                </div>
            </section>
        `;
    }

    private navigate(): string {
        return `
            <ul class="nav nav-pills nav-fill gap-3">
                <li class="nav-item">
                    <a class="nav-link active rounded-5 fs-2 fw-medium shadow-sm" aria-current="page" href="#">For Learning English</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link rounded-5 fs-2 fw-medium shadow-sm" href="#">For Web Development</a>
                </li>
            </ul>
        `;
    }

    connectedCallback(): void {
    }
}

customElements.define("app-work", WorkPage);
export default WorkPage;
