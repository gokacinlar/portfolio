import Localize from "../utils/initLocalization";
import { HeroImageWithLink } from "../components/C_Hero";
import { Template, TypeWriterDisplay, DomEvents } from "../utils/helper";
import { BodyParts, HeroParts } from "../static";

class HeroSection extends HTMLElement {
    private bodyParts: BodyParts;
    constructor() {
        super();
        this.bodyParts = new BodyParts();
        new Template().createTemplate(new HeroTemplate().hero(), this);
    }

    connectedCallback(): void {
        new TypeWriterDisplay(new HeroParts(), "ocps");
        const domEvents = new DomEvents();
        const mottosElement = this.querySelector("#mottosSection") as HTMLDivElement;
        const mottos = this.bodyParts.mottos;
        if (mottosElement) {
            domEvents.appendContent(mottosElement, mottos);
        }
    }
}

class HeroTemplate {
    constructor() { }

    public hero(): string {
        return /*html*/ `
            <section class="mx-2 my-2 px-2 py-2">
                <div id="hero" class="container mx-0 my-0 rounded-5 mw-100 bg-gradient shadow-sm py-5 d-flex flex-column justify-content-between">
                    <div class="row align-items-center justify-content-evenly hero-child px-4">
                        <section class="col-12 col-md-6 d-flex flex-column align-items-start gap-4 ocps-container mb-4 mb-md-0">
                            <div class="hero-title-container">
                                <h3 class="font-weight-bolder text-muted">${Localize.translate("common:hero:greet")}</h3>
                                <h2 class="font-weight-bolder text-decoration-underline">Derviş</h2>
                            </div>
                            <div class="hero-dynamic-text-container">
                                <h1 id="ocps" class="occupations display-3">
                                    <span class="ocps-written-text"></span><span class="cursor">|</span>
                                </h1>
                            </div>
                            <div class="ocps-buttons d-flex flex-row align-items-center gap-2 w-100">
                                <component-header-hire-btn class="w-100">
                                </component-header-hire-btn>
                                ${this.heroDownloadCVButton()}
                            </div>
                        </section>
                        <section class="col-12 col-md-6 d-flex justify-content-center ocps-hero-img-container">
                            ${new HeroImageWithLink().render(
            "Derviş Öksüzoğlu",
            "heroLogoBg",
            "",
            "../assets/images/static/webp/logo.webp",
            "../assets/images/static/webp/logo_256x256.webp 256w, ../assets/images/static/webp/logo_512x512.webp 512w, ../assets/images/static/webp/logo.webp 1024w",
        )}
                        </section>
                    </div>
                    <section id="mottosSection" class="d-flex flex-row flex-wrap align-items-center justify-content-center gap-2 mt-4 mb-0">
                    </section>
                </div>
            </section>
        `;
    }

    private heroDownloadCVButton(): string {
        return /*html*/ `
            <button id="hrGetCvBtn" type="button" class="hero-btn bee-color-btn text-truncate hero-get-cv-btn bg-gradient btn btn-lg fs-4 w-100 shadow-sm d-flex flex-row align-items-center justify-content-center gap-1
                rounded-5 shadow-sm" title="${Localize.translate("common:hero:buttonTitles:downloadCV")}">
                <i class="bi bi-paperclip"></i>
                <span class="hr-btn-text">${Localize.translate("common:hero:buttons:cv")}</span>
            </button>
        `;
    }
}

export default HeroSection;
customElements.define("app-hero", HeroSection);