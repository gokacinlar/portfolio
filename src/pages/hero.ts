// Components
import { HeroImageWithLink } from "../components/C_Hero";
import { Template, TypeWriterDisplay, DomEvents } from "../helper";
import { BodyParts, HeroParts } from "../static";

class HeroSection extends HTMLElement {
    private template: Template;
    constructor() {
        super();
        this.template = new Template();

        const template = this.template.createTemplate(new HeroTemplate().hero());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        new TypeWriterDisplay(new HeroParts, "ocps");
        new HeroTemplate().connectedCallback();
    }
}

class HeroTemplate {
    private bodyParts: BodyParts;
    constructor() {
        this.bodyParts = new BodyParts();
    }

    public hero(): string {
        return `
            <section class="mx-2 my-2 px-2 py-2">
                <div id="hero" class="d-flex align-items-center justify-content-around flex-column rounded-5 bg-gradient shadow-sm">
                    <div class="hero-child container-fluid mx-0 px-5 py-5 d-flex flex-row align-items-center justify-content-around">
                        <section class="row ocps-container col-sm d-flex flex-column align-items-start gap-4">
                            <div>
                                <h3 class="font-weight-bolder text-muted">Hi! I'm</h3>
                                <h2 class="font-weight-bolder text-decoration-underline">Derviş</h2>
                            </div>
                            <div>
                                <h1 id="ocps" class="occupations display-3">
                                    <span class="ocps-written-text"></span><span class="cursor">|</span
                                </h1>
                            </div>
                            <div class="ocps-buttons d-flex flex-row align-items-center gap-2">
                                ${this.heroBtns()}
                            </div>
                        </section>
                        <section class="row ocps-hero-img-container col-sm">
                            ${new HeroImageWithLink().render(
            "Derviş Öksüzoğlu",
            "heroLogoBg",
            "",
            "../assets/images/static/logo.jpg",
            "../assets/images/static/logo_256x256.jpg 256w, ../assets/images/static/logo_512x512.jpg 512w, ../assets/images/static/logo.jpg 1024w",
        )}
                        </section>
                    </div>
                    <section id="mottosSection" class="d-flex flex-row flex-wrap align-items-center justify-content-center gap-2 mb-2">
                    </section>
                </div>
            </section>
        `;
    }

    private heroBtns(): string {
        return `
            <button id="hrBtn" type="button" class="hero-btn text-truncate hero-hire-btn bg-gradient btn btn-lg fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-1
                rounded-5 shadow-sm" title="Proceed to hire me for your eduation or web demands.">
                <i class="bi bi-star-half pulsate-fwd"></i>
                <span class="hr-btn-text">Work w/me!</span>
            </button>
            <button id="hrGetCvBtn" type="button" class="hero-btn text-truncate hero-get-cv-btn bg-gradient btn btn-lg fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-1
                rounded-5 shadow-sm" title="Download My CV">
                <i class="bi bi-paperclip"></i>
                <span class="hr-btn-text">Get Derviş's CV</span>
            </button>
        `;
    }

    connectedCallback(): void {
        const domEvents = new DomEvents();
        document.addEventListener("DOMContentLoaded", () => {
            const mottosElement = document.querySelector("#mottosSection") as HTMLDivElement;
            const mottos = this.bodyParts.mottos;
            domEvents.appendContent(mottosElement, mottos);
        });
    }
}

export default HeroSection;
customElements.define("app-hero", HeroSection);