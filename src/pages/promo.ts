// Libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Components"
import { PromoTitle, PromoCard } from "../components/promo";
import { Template, PromoFunctions } from "../helper";
// Json Data
import posts from '../assets/json/posts.json';

class Promo extends HTMLElement {
    private template: Template;
    private promoTemplate: PromoTemplate;
    private promoFunctions: PromoFunctions;

    constructor() {
        super();
        this.template = new Template();
        this.promoTemplate = new PromoTemplate();
        this.promoFunctions = new PromoFunctions();

        const template = this.template.createTemplate(this.promoTemplate.promoTemplate());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        this.promoFunctions.createMarqueeStack(".marquee-content");
        this.promoFunctions.createPromoPosts("#promoCardContainer", posts);
    }
}

class PromoTemplate {
    public promoTemplate(): string {
        return `
            <section id="promo" class="mx-2 my-2 rounded-5">
                <div class="container-fluid w-100 px-2 py-2 d-flex flex-column gap-4">
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        <div>
                            ${new PromoTitle("I'm proficient in:")}
                        </div>
                        <div class="promo-marquee w-100">
                            <div class="marquee-container overflow-hidden">
                                <div class="marquee-content d-flex flex-row align-items-center px-2 py-2 gap-4">
                                    <!--Marquee goes here-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        <div>
                            ${new PromoTitle("Some of my projects are:")}
                        </div>
                        <div id="promoCardContainer" class="d-flex flex-wrap gap-3 justify-content-center">
                            <!-- Cards will be injected here -->
                        </div>
                    </div>
                </div>
            </section>
        `;
    }

    public promoOne(): string {
        return `

        `;
    }
}

export default Promo;
customElements.define("app-promo", Promo);