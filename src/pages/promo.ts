// Libraries
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import VanillaTilt from "vanilla-tilt";
// Components"
import { PromoTitle, PromoDescription, PromoCard, PromoSkillsShowCase, PromoContact } from "../components/promo";
import { VideoElement } from "../components/video";
import { Template, PromoFunctions } from "../helper";
// Json Data
import posts from '../assets/json/posts.json';
import skills from '../assets/json/promo_Skills.json';
import links from '../assets/json/social_Links.json';

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
        this.promoFunctions.createPromoContent("#promoCardContainer", posts, (post) => new PromoCard().renderPromoCard(post));
        this.promoFunctions.createPromoContent("#promoSkillsContainer", skills, (skill) => new PromoSkillsShowCase().renderPromoSkillsShowCase(skill));
        this.promoFunctions.createPromoContent("#pfnSocials", links, (link) => new PromoContact().renderPromoContacts(link));

        // Initialize the tilt.js
        const elements = document.querySelectorAll(".js-tilt") as any;
        VanillaTilt.init(elements);
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
                    <div class="column col-12 d-flex flex-column gap-4 align-items-center justify-content-center">
                        ${this.promoSkills()}
                        <div id="promoSkillsContainer" class="w-75 d-flex flex-row align-items-center justify-content-center gap-4">
                        </div>
                    </div>
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoProjectCards()}
                    </div>
                    <div class="column col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoFinalNote()}
                    </div>
                </div>
            </section>
        `;
    }

    private promoSkills(): string {
        return `
            <div class="align-self-start">
                ${new PromoTitle("I'm proficient in")}
            </div>
        `;
    }

    // Since I didn't like this marquee thing, static showcase would be sufficient for now
    /*
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
    */

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
                ${new PromoDescription().renderPromoDesc()}
            </div>
        `;
    }

    private promoFinalNote(): string {
        return `
            <div id="promoFinalNote" class="container-fluid w-100 px-4 py-4 d-flex flex-column gap-2 align-items-center justify-content-evenly">
                <h2 class="display-1 fw-bolder">Keep in touch with me!</h2>
                <div id="pfnSocials" class="d-flex flex-row align-items-center justify-content-center gap-4">
                    <!--Social Links will go here-->
                </div>
            </div>
        `;
    }
}

export default Promo;
customElements.define("app-promo", Promo);