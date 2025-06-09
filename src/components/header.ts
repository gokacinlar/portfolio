// Crucial imports
import '../assets/css/index.css';
import '../assets/images/favicon/favicon.ico';
// Libraries
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Template } from '../helper';

export default class Header extends HTMLElement {
    private template: Template;
    private headerTemplate: HeaderNode;
    constructor() {
        super();
        this.template = new Template();
        this.headerTemplate = new HeaderNode();

        const template = this.template.createTemplate(this.headerTemplate.headerItself());
        this.appendChild(template.content.cloneNode(true));
    }
}

class HeaderNode {
    public headerItself(): string {
        return `
            <nav class="header-bg m-1 shadow-lg px-2 py-2 rounded-5">
                <section>
                </section>
                <ul class="list-unstyled mb-0 d-flex flex-row gap-2">
                    <li><a href="" title="Home" class="bg-gradient btn header-btn-bg btn-lg  rounded-5"><i class="bi bi-house-door"></i> Home</a></li>
                    <li><a href="" title="Blog" class="bg-gradient btn header-btn-bg btn-lg rounded-5"><i class="bi bi-journals"></i> Blog</a></li>
                    <li><a href="" title="About" class="bg-gradient btn header-btn-bg btn-lg rounded-5"><i class="bi bi-person-circle"></i> About</a></li>
                </ul>
                <section>
                </section>
            </nav>
        `;
    }
}

customElements.define("app-header", Header);