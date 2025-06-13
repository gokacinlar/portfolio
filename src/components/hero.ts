// Crucial imports
import "../assets/css/index.css";
// Libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Components"
import { Template, TypeWriterDisplay } from "../helper";
import { BodyParts, HeroParts } from "../static";

class HeroSection extends HTMLElement {
    private template: Template;
    private heroTemplate: HeroTemplate;
    constructor() {
        super();
        this.template = new Template();
        this.heroTemplate = new HeroTemplate();

        const template = this.template.createTemplate(this.heroTemplate.hero());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        new TypeWriterDisplay(new HeroParts, "ocps");
        this.heroTemplate.connectedCallback();
    }
}

class HeroTemplate {
    private bodyParts: BodyParts;
    constructor() {
        this.bodyParts = new BodyParts();
    }

    public hero(): string {
        return `
            <section class="mx-2 my-2">
                <div id="hero" class="d-flex align-items-center justify-content-between flex-column rounded-5 bg-gradient shadow-md">
                    <div class="container-fluid mx-0 px-5 py-5 d-flex flex-row align-items-center justify-content-around">
                        <section class="row col-6 d-flex flex-column align-items-start gap-4">
                            <div>
                                <h3 class="font-weight-bolder text-muted">Hi! I'm</h3>
                                <h2 class="font-weight-bolder text-decoration-underline">Derviş</h2>
                            </div>
                            <div>
                                <h1 id="ocps" class="occupations display-3">
                                    <span class="ocps-written-text"></span><span class="cursor">|</span
                                </h1>
                            </div>
                            <div class="d-flex flex-row align-items-center gap-1">
                                ${this.heroBtns()}
                            </div>
                        </section>
                        <section class="row col-6">
                            <a id="heroLogoBg"href="" class="d-flex justify-content-center link-offset-2 link-underline link-underline-opacity-0">
                                <img
                                    class="hero-logo img-fluid"
                                    src="../assets/images/static/logo.jpg"
                                    srcset="../assets/images/static/logo_256x256.jpg 256w, ../assets/images/static/logo_512x512.jpg 512w,
                                    ../assets/images/static/logo.jpg 1024w"
                                    sizes="(max-width: 600px) 256px, (max-width: 960px) 512px, 1024px"
                                    alt="Derviş Öksüzoğlu"
                                    title="Derviş Öksüzoğlu"
                                    height="auto"
                                    loading="lazy"
                                    decoding="async"
                                    />
                            </a>
                        </section>
                    </div>
                    <section id="mottosMarquee" class="d-flex flex-row align-items-center justify-content-center gap-2">
                    </section>
                </div>
            </section>
        `;
    }

    private heroBtns(): string {
        return `
            <button id="hrBtn" type="button" class="header-btn-bg-important bg-gradient btn btn-lg fs-4 shadow-md d-flex flex-row align-items-center gap-2
                rounded-5 shadow-sm border border-secondary-subtle"
                title="Proceed to hire me for your eduation or web demands.">
                <i class="bi bi-star-half pulsate-fwd"></i>
                <span class="hr-btn-text">Hire me!</span>
            </button>
            <button id="hrDayNightBtn" type="button" class="header-btn-bg-alt bg-gradient btn btn-lg fs-4 shadow-md d-flex flex-row align-items-center gap-1 
                shadow-sm border border-secondary-subtle"
                title="Download My CV">
                <i class="bi bi-paperclip"></i>
                <span class="hr-btn-text">Get Derviş's CV</span>
            </button>
        `;
    }

    // Function to append mottos into DOM with sequential order
    private async appendContent(target: HTMLElement, content: Array<string>): Promise<void> {
        for (let i in content) {
            let p = document.createElement("p") as HTMLParagraphElement;
            p.textContent = content[i];
            p.classList.add("motto-elements", "p-3", "fs-6", "fw-bolder", "rounded-5", "pe-none", "shadow-sm")
            // Use promise-resolve to sequentially place the array items into dom
            await new Promise<void>((resolve) => {
                setTimeout(() => {
                    target.appendChild(p);
                    resolve();
                }, 1000);
            });
        }
    }

    connectedCallback(): void {
        document.addEventListener("DOMContentLoaded", () => {
            const mottosElement = document.querySelector("#mottosMarquee") as HTMLDivElement;
            const mottos = this.bodyParts.mottos;
            this.appendContent(mottosElement, mottos).then(() => {

                // After all mottos are appended, apply the scale-up effect sequentially
                // indicating mottos are finished and now marquee now can begin
                const paragraphs = document.querySelectorAll(".main-landing-mottos > p");
                paragraphs.forEach((p, index) => {
                    setTimeout(() => {
                        p.classList.add("scale-up");
                        setTimeout(() => {
                            p.classList.remove("scale-up");
                        }, 1000);
                    }, index * 2000);
                });
            });
        });
    }
}

export default HeroSection;
customElements.define("app-hero", HeroSection);