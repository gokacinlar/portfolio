import shuffleLetters from "shuffle-letters";
import { Template, HorizontalMiddleMouseScroll, insertApprovedScript } from "../utils/helper";
import { HeroImageWithLink } from "../components/C_Hero";
import ScrollSpy from "../components/A_ScrollSpy";

// Interfaces
interface SkillConfig {
    imageOne: string;
    imageTwo: string;
    title: string;
}

interface HeroConfig {
    name: string;
    className: string;
    link: string;
    imageSrc: string;
    srcSet: string;
}

interface ShuffleElement {
    selector: string;
    multiple: boolean;
}

interface SocialsElement {
    name: string;
    icon: string;
    href: URL;
}

class About extends HTMLElement {
    constructor() {
        super();
        this.render();
        this.initializeShuffleEffects();
        this.initCaptcha();
        new HorizontalMiddleMouseScroll().hmmsScroll(".scrollspy-nav");
    }

    private initCaptcha() {
        // Load reCAPTCHA script after DOMContentLoaded and render when loaded
        document.addEventListener("DOMContentLoaded", () => {
            const scriptUrl: string = "https://www.google.com/recaptcha/api.js";
            const scriptOptions = {
                scriptItself: scriptUrl,
                target: document.head,
                attributes: {
                    defer: true,
                    async: true
                }
            }

            try {
                insertApprovedScript(scriptOptions);
            } catch (error: unknown) {
                console.error("Error while inserting script:", error);
                return;
            }
        });
    }

    private readonly heroConfig: HeroConfig = {
        name: "Derviş Öksüzoğlu",
        className: "heroLogoBg",
        link: "",
        imageSrc: "../assets/images/static/webp/logo.webp",
        srcSet: "../assets/images/static/webp/logo_256x256.webp 256w, ../assets/images/static/webp/logo_512x512.webp 512w, ../assets/images/static/webp/logo.webp 1024w"
    };

    private readonly skillConfigs: SkillConfig[] = [
        {
            imageOne: "../assets/images/static/svg/flags/uk.svg",
            imageTwo: "../assets/images/static/svg/flags/tr.svg",
            title: "English Teacher"
        },
        {
            imageOne: "../assets/images/static/svg/js.svg",
            imageTwo: "../assets/images/static/svg/ts.svg",
            title: "Frontend Developer"
        }
    ];

    private readonly shuffleElements: ShuffleElement[] = [
        { selector: ".aside-title", multiple: false },
        { selector: ".aside-skill", multiple: true },
        { selector: ".aside-social-text", multiple: true },
    ];

    private readonly SocialsElements: SocialsElement[] = [
        { name: "GitHub", icon: "bi bi-github", href: new URL("https://github.com/gokacinlar") },
        { name: "X/Twitter", icon: "bi bi-twitter-x", href: new URL("https://x.com/devDissentNT") },
        { name: "Mastodon", icon: "bi bi-mastodon", href: new URL("https://mastodon.social/@gokacinlar") },
        { name: "Hashnode", icon: "bi bi-book", href: new URL("https://gokacinlar.hashnode.dev/") },
        { name: "E-mail", icon: "bi bi-mailbox", href: new URL("mailto:gokacinlar@tutanota.com?subject=To%20Dervi%C5%9F ") }
    ]

    private render(): void {
        const template = new Template().createTemplate(this.renderContent(), this);
    }

    private initializeShuffleEffects(): void {
        // Case for choosing multiple or singular elements
        this.shuffleElements.forEach(({ selector, multiple }) => {
            if (multiple) {
                document.querySelectorAll(selector).forEach(element => {
                    shuffleLetters(element);
                });
            } else {
                const element = document.querySelector(selector);
                if (element) {
                    shuffleLetters(element);
                }
            }
        });
    }

    private renderContent(): string {
        return `
            <section id="about-grid" class="container-fluid mb-3">
                <div id="about-grid-parent" class="row gy-3 gx-3 px-2">
                    <div class="col-12 col-md-4 col-sm">
                        ${this.renderAside()}
                    </div>
                    <div class="col-12 col-md-8 col-sm">
                        ${this.renderMain()}
                    </div>
                </div>
            </section>
        `;
    }

    private renderAside(): string {
        return `
        <aside id="about-aside" class="bg-gradient rounded-5 shadow-sm py-3 px-4 h-100">
            <div>
                ${this.renderHeroSection()}
                ${this.renderSkillsSection()}
                ${this.renderSocials()}
                ${this.renderMotto()}
            </div>
        </aside>
    `;
    }

    private renderMain(): string {
        return `
        <section id="about-main" class="bg-gradient rounded-5 shadow-sm py-3 px-3 overflow-auto">
            ${new ScrollSpy().render()}
        </section>
    `;
    }

    private renderHeroSection(): string {
        // I should probably begin to use destructuring with interfaces on importing elements like these
        // why didn't I define these as another web component is beyond me
        const { name, className, link, imageSrc, srcSet } = this.heroConfig;
        return `
            ${new HeroImageWithLink().render(name, className, link, imageSrc, srcSet)}
            <div class="pe-none">
                <h1 class="aside-title fw-medium mt-3 mb-0 text-center">${name}</h1>
                <hr class="border border-2 border-secondary">
            </div>
        `;
    }

    private renderSkillsSection(): string {
        return `
            <div>
                ${this.skillConfigs.map(skill => this.renderSkill(skill)).join("")}
                <hr class="border border-2 border-secondary">
            </div>
        `;
    }

    private renderSkill({ imageOne, imageTwo, title }: SkillConfig): string {
        return `
            <h2 class="aside-skill-name d-flex flex-row align-items-center gap-1 mb-1">
                <div class="d-flex align-items-center gap-1 px-1 py-1">
                    <img src="${imageOne}" class="aside-ico img-fluid lazyload rounded-1">
                    <img src="${imageTwo}" class="aside-ico img-fluid lazyload rounded-1">
                </div>
                <span class="aside-skill fs-4 text-start">${title}</span>
            </h2>
        `;
    }

    private renderSocials(): string {
        return `
            <div class="d-flex flex-row flex-wrap align-items-start justify-content-evenly gap-1">
                ${this.SocialsElements.map(({ name, icon, href }) => `
                    <div class="aside-socials mb-2 rounded-pill shadow-sm flex-grow-1">
                        <a href="${href}" class="d-flex flex-row align-items-center gap-2 px-2 py-2 link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover" target="_blank" title="${name}">
                            <i class="${icon} fs-3 px-1 py-1"></i>
                            <p class="aside-social-text h6 fw-medium mb-0">${name}</p>
                            <i class="bi bi-arrow-right fs-4"></i>
                        </a>
                    </div>
                `).join("")}
            </div>
            <hr class="border border-2 border-secondary">
        `;
    }

    private renderMotto(): string {
        return `
            <blockquote class="blockquote text-center mt-auto mb-auto">
                <p><em>Teaching for <strong>life</strong>, coding for <strong>passion</strong>.</em></p>
            </blockquote>
        `;
    }
}

export default About;
customElements.define("app-about", About);