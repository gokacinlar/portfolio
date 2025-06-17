// Libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Components"
import { PromoTitle } from "../components/promo";
import { VideoElement } from "../components/video";
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
    private videoOne = new VideoElement({
        title: "Teaching for Life",
        webmSrc: "./assets/videos/teach.webm",
        mp4FallbackSrc: "./assets/videos/teach.mp4",
        posterSrc: ""
    });

    private videoTwo = new VideoElement({
        title: "Coding for Passion",
        webmSrc: "./assets/videos/code.webm",
        mp4FallbackSrc: "./assets/videos/code.mp4",
        posterSrc: ""
    });

    public promoTemplate(): string {
        return `
            <section id="promo" class="mx-2 my-2 rounded-5">
                <div class="container-fluid w-100 px-2 py-2 d-flex flex-column gap-4">
                    <div class="column col-12 d-flex flex-row gap-3 align-items-center justify-content-center">
                        ${this.promoVideos()}
                    </div>
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoDesc()}
                    </div>
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoMarquee()}
                    </div>
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoProjectCards()}
                    </div>
                </div>
            </section>
        `;
    }

    private promoMarquee(): string {
        return `
            <div class="align-self-start">
                ${new PromoTitle("I'm proficient in")}
            </div>
            <div class="promo-marquee w-100">
                <div class="marquee-container overflow-hidden">
                    <div class="marquee-content d-flex flex-row align-items-center px-2 py-2 gap-4">
                        <!--Marquee goes here-->
                    </div>
                </div>
            </div>
        `;
    }

    private promoProjectCards(): string {
        return `
            <div class="align-self-start">
                ${new PromoTitle("Some of my projects are")}
            </div>
            <div id="promoCardContainer" class="d-flex flex-wrap gap-3 justify-content-center">
                <!-- Cards will be injected here -->
            </div>
        `;
    }

    private promoVideos(): string {
        return `
            <div class="col-6 overflow-hidden">
                ${this.videoOne.render("Teaching for Life")}
            </div>
            <div class="col-6 overflow-hidden">
                ${this.videoTwo.render("Coding for Passion")}
            </div>
        `;
    }

    private promoDesc(): string {
        return `
            <div class="align-self-start">
                ${new PromoTitle("I describe myself as")}
            </div>
            <div id="promo_Description" class="container-fluid w-100 px-4 py-4 d-flex flex-row gap-2 align-items-center justify-content-around">
                <div class="col-4">
                    <ul class="list-unstyled">
                        <li>
                            <button class="btn btn-lg">
                                Problem Solver
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-lg">
                                Progressive
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-lg">
                                Realistic
                            </button>
                        </li>
                        <li>
                            <button class="btn btn-lg">
                                Progressive
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="col-8">
                    hi
                </div>
            </div>
        `;
    }
}

export default Promo;
customElements.define("app-promo", Promo);