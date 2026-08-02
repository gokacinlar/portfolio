// Components
import { Template } from "../utils/helper";
import { FooterLinks } from "../static";
import Localize from "../utils/initLocalization";

class Footer extends HTMLElement {
    constructor() {
        super();
        new Template().createTemplate(new FooterNodes().footerTemplate(), this);
    }
}

class FooterNodes {
    constructor() { }

    public footerTemplate(): string {
        return /*html*/ `
            <section class="footer-container rounded-top-5 mx-2 my-2 px-2 py-2 d-flex flex-row align-content-center justify-content-between gap-2">
                <div class="footer-left d-flex align-items-start gap-3 px-2 py-2 rounded-5 bg-secondary-subtle shadow-sm">
                    ${this.footerLeft()}
                </div>
                <div class="footer-right d-flex rounded-5 d-flex flex-row flex-wrap align-items-center justify-content-center gap-2">
                    <div class="align-items-center bg-secondary-subtle rounded-5">
                        ${this.footerRight()}
                    </div>
                    <component-custom-button
                        class="bee-color-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-1 modal-trigger"
                        id="sitemapModalBtn"
                        type="button"
                        title="${Localize.translate("common:footer:sitemap")}"
                        data-modal="siteMapModal">
                        <i class="bi bi-diagram-3 fs-3 fw-bold"></i>
                    </component-custom-button>
                </div>
            </section>
        `;
    }

    public footerLeft(): string {
        const personalLinks = this.createPersonalLinks();

        return /*html*/ `
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
                ariaLabel: Localize.translate("common:footer:ccZero"),
                src: "cc-zero.svg",
                title: Localize.translate("common:footer:ccZero")
            },
            {
                href: FooterLinks.BRANDING_LINKS.notByAi,
                ariaLabel: Localize.translate("common:footer:notByAi"),
                src: "notbyai.svg",
                title: Localize.translate("common:footer:notByAi")
            }
        ];

        const brandingHTML = brandingLinks.map(link => `<li>${this.createFooterLink(link.href, link.ariaLabel, link.src, link.title)}</li>`)
            .join("");

        return /*html*/ `
            <ul class="footer-brading-list list-unstyled d-flex flex-row align-items-center gap-2 px-2 mb-0 h-100">
                ${brandingHTML}
            </ul>
        `;
    }

    private createPersonalLinks(): string {
        const { github } = FooterLinks.PERSONAL_LINKS;

        const linkData = [
            { title: Localize.translate("common:misc:github"), href: github, iconClass: "bi-github" },
        ];

        return linkData.map(link => `
                <li class="w-100">
                    <a class="d-flex flex-row align-items-center footer-links gap-2 px-2 py-2
                    fw-medium link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                        title="${link.title}" href="${link.href}" hreflang="x-default" target="_blank">
                        <i class="bi ${link.iconClass} fs-3"></i> ${link.title}
                    </a>
                </li>
            `).join("");
    }

    private createFooterLink(href: string, ariaLabel: string, src: string, title: string): string {
        return /*html*/ `
            <a href="${href}" hreflang="x-default" target="_blank" aria-label="${ariaLabel}">
                <img class="footer-right-brand rounded-pill img-fluid w-100 h-100 lazyload" loading="lazy" decoding="async"
                    src="../assets/images/static/svg/${src}" title="${title}">
            </a>
        `;
    }
}

export default Footer;
customElements.define("app-footer", Footer);