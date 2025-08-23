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
    constructor() { }

    public footerTemplate(): string {
        return `
            <section class="footer-container rounded-top-5 mx-2 my-2 px-2 py-2 d-flex flex-row align-content-center justify-content-between">
                <div class="footer-left d-flex align-items-start gap-3 px-2 py-2 rounded-5">
                    ${this.footerLeft()}
                </div>
                <div class="d-flex align-items-center">
                    ${this.footerRight()}
                </div>
            </section>
        `;
    }

    public footerLeft(): string {
        const headerLeft = new HeaderNode().headerLeft();
        const personalLinks = this.createPersonalLinks();

        return `
            ${headerLeft}
            <hr class="vr text-white border border-opacity-75 border-warning h-100 my-auto"></hr>
            <nav>
                <ul class="footer-promo-links list-unstyled d-flex flex-row align-items-start justify-content-center gap-1 mb-0">
                    ${personalLinks}
                </ul>
            </nav>
        `;
    }

    public footerRight(): string {
        const brandingLinks = [
            {
                href: FooterLinks.BRANDING_LINKS.cc010,
                ariaLabel: "Creative Commons CC0 1.0 Universal License",
                src: "cc-zero.svg",
                title: "Creative Commons CC0 1.0 Universal License"
            },
            {
                href: FooterLinks.BRANDING_LINKS.notByAi,
                ariaLabel: "NotByAI Badge",
                src: "notbyai.svg",
                title: "NotByAI Badge"
            }
        ];

        const brandingHTML = brandingLinks.map(link => `<li>${this.createFooterLink(link.href, link.ariaLabel, link.src, link.title)}</li>`)
            .join("");

        return `
            <ul class="footer-brading-list list-unstyled d-flex flex-row gap-2 px-2 mb-0 h-100">
                ${brandingHTML}
            </ul>
        `;
    }

    private createPersonalLinks(): string {
        const { github, xTwitter, mastodon } = FooterLinks.PERSONAL_LINKS;

        const linkData = [
            { title: "GitHub", href: github, iconClass: "bi-github" },
            { title: "X (Twitter)", href: xTwitter, iconClass: "bi-twitter-x" },
            { title: "Mastodon", href: mastodon, iconClass: "bi-mastodon" },
        ];

        return linkData.map(link => `
                <li class="w-100">
                    <a class="d-flex flex-row align-items-center footer-links gap-2 px-2 py-2
                    fw-medium link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                        title="${link.title}" href="${link.href}" target="_blank">
                        <i class="bi ${link.iconClass} fs-3"></i> ${link.title}
                    </a>
                </li>
            `).join("");
    }

    private createFooterLink(href: string, ariaLabel: string, src: string, title: string): string {
        return `
            <a href="${href}" target="_blank" aria-label="${ariaLabel}">
                <img class="footer-right-brand img-fluid w-100 h-100"
                    src="../assets/images/static/svg/${src}" title="${title}">
            </a>
        `;
    }
}

export default Footer;
customElements.define("app-footer", Footer);