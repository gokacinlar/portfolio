import { Template } from "../helper";

class Updates extends HTMLElement {
    constructor() {
        super();

        const template = new Template().createTemplate(this.render());
        this.appendChild(template.content.cloneNode(true));
    }

    private render(): string {
        return `
            <section>

            </section>
        `;
    }
}

customElements.define("app-updates", Updates);