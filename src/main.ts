// Crucial imports
import "./assets/css/index.css";
// Libraries
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// Components
import { Template } from './helper';
import "./components/header";
import "./components/footer";

class HomePage extends HTMLElement {
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

export default HomePage;
customElements.define("app-main", HomePage);