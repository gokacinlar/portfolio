// Libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Components
import { HeaderNode } from "./header";
import { Template } from "../helper";
import { FooterLinks } from "../static";

class Footer extends HTMLElement {
    constructor() {
        super();

        const template = new Template().createTemplate(new FooterNodes().footerTemplate());
        this.appendChild(template.content.cloneNode(true));
    }
}

class FooterNodes {
    private fLinks: FooterLinks;
    private headerN: HeaderNode;

    constructor() {
        this.fLinks = new FooterLinks();
        this.headerN = new HeaderNode();
    }

    public footerTemplate(): string {
        return `
            <div class="footer-container p-2 my-0 d-flex flex-row align-content-center justify-content-between">
                <section class="d-flex align-items-center gap-2">
                    ${this.footerLeft()}
                </section>
                <section class="d-flex align-items-center">
                    ${this.footerRight()}
                </section>
            </div>
        `;
    }

    public footerLeft(): string {
        return `
            ${this.headerN.headerLeft()}
            <div class="vr text-white"></div>
            <nav>
                <ul class="footer-promo-links list-unstyled d-flex flex-row align-items-center justify-content-center gap-2 mb-0">
                    <li><a class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover p-2 shadow-lg"
                    title="GitHub" href="" target="_blank"><i class="bi bi-github"></i></a></li>
                    <li><a class="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover p-2 shadow-lg"
                    title="E-mail" href="" target="_blank"><i class="bi bi-envelope-paper"></i></a></li>
                </ul>
            </nav>
        `;
    }

    public footerRight(): string {
        return `
            <ul class="list-unstyled d-flex flex-row align-content-center justify-content-around gap-2 px-2 mb-0">
                <li><a href="${this.fLinks.fLinks.cc010}"" target="_blank" aria-label ="Creative Commons CC0 1.0 Universal License">
                    <img class="footer-right-brand img-fluid w-100 h-100" src="../assets/images/static/svg/cc-zero.svg" title="Creative Commons CC0 1.0 Universal License"></a></li>
                <div class="vr text-white"></div>
                <li><a href="${this.fLinks.fLinks.notByAi}" target="_blank" aria-label="NotByAI Badge">
                    <img class="footer-right-brand img-fluid" src="../assets/images/static/svg/notbyai_eng.svg" title="NotByAI Badge"></a></li>
            </ul>
        `;
    }
}

export default Footer;
customElements.define("app-footer", Footer);