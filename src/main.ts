// Crucial imports
import './assets/css/index.css';
import './assets/images/favicon/favicon.ico';
// Libraries
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Template } from './helper';
// Components
import './components/header';

export default class HomePage extends HTMLElement {
    private template: Template;
    private homePageNode: HomePageNode;
    constructor() {
        super();
        this.template = new Template();
        this.homePageNode = new HomePageNode();

        const template = this.template.createTemplate(this.homePageNode.homePageTemplate());
        this.appendChild(template.content.cloneNode(true));
    }
}

class HomePageNode {
    public homePageTemplate(): string {
        return `
            <div class="px-2">
                Hi
            </div>
        `;
    }
}

customElements.define("app-main", HomePage);