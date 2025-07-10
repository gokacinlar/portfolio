import { Template } from '../helper';

class About extends HTMLElement {
    constructor() {
        super();
        const template = new Template().createTemplate(this.renderContent());
        this.appendChild(template.content.cloneNode(true));
    }

    public renderContent(): string {
        return `
            <h1>Hello</h1>
        `;
    }
}

export default About;
customElements.define("app-about", About);