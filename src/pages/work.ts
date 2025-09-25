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
                            <h1 class="display-1 text-start fw-medium pe-none"><mark class="px-4 py-1 rounded-end-5">Hire</mark> me or see my plans <span class="wavy-text">below.</span></h1>
                        </div>
                        <div class="col-xs-12 col-sm-12 col-md-6">
                            Column
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    connectedCallback(): void {
    }
}

customElements.define("app-work", WorkPage);
export default WorkPage;
