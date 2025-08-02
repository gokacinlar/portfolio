import { Template } from "../helper";

class PageNotFound extends HTMLElement {
    constructor() {
        super();
        const template = new Template().createTemplate(this.render());
        this.appendChild(template.content.cloneNode(true));
    }

    public render(): string {
        return `
            <div>
                <h1>Opps! Page you were looking doesn't exist!</h1>
                <div>
                    <h2></h2>
                </div>
            </div>
        `;
    }
}

export default PageNotFound;
customElements.define("app-404", PageNotFound);