// Components
import { PromoTitle, PromoDescription, PromoCard, PromoSkillsShowCase, PromoTeachEnglish, PromoMotto, PromoInterested } from "../components/C_Promo";
import { VideoElement } from "../components/C_Video";
import { Template, PromoFunctions, HorizontalMiddleMouseScroll, ScrollRevealAction } from "../helper";
import { PromoParts } from "../static";
// JSON Data
import posts from '../assets/json/posts.json';
import skills from '../assets/json/promo_Skills.json';

class Promo extends HTMLElement {
    constructor() {
        super();

        const template = new Template().createTemplate(new PromoTemplate().promoTemplate());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        // Create promo elements
        const promoFunctions = new PromoFunctions();
        promoFunctions.createPromoContent("#promoCardContainer", posts, (post) => new PromoCard().renderPromoCard(post));
        promoFunctions.createPromoContent("#promoSkillsContainer", skills, (skill) => new PromoSkillsShowCase().renderPromoSkillsShowCase(skill));
        // Create vertical tab grouping showcase
        promoFunctions.bindVerticalTabEventsAndautoCycleTabs(new PromoParts().promoTabData);
        new HorizontalMiddleMouseScroll().hmmsScroll(".promo-featured-tabs");
        // Dyanmic scroll revealing
        const dynamicContentDivs: Array<string> =
            ["promo-videos-container",
                "promo-desc-container",
                "promo-skills-container",
                "promo-projects-container",
                "promo-motto-container",
                "promo-teacheng-container",
                "promo-interested-container"];
        new ScrollRevealAction().scrollReveal(dynamicContentDivs);
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
                    <div class="promo-videos-container row col-12 mx-auto d-flex flex-row gap-3 align-items-center justify-content-center">
                        ${this.promoVideos()}
                    </div>
                    <div class="promo-desc-container row col-12 mx-auto d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoDesc()}
                    </div>
                    <div class="promo-skills-container row col-12 mx-auto d-flex flex-column gap-4 align-items-center justify-content-center overflow-hidden">
                        ${this.promoSkills()}
                        <div class="psc-container w-100 position-relative overflow-hidden rounded-5">
                            <div id="promoSkillsContainer" class="d-flex flex-row align-items-center justify-content-center gap-4"></div>
                        </div>
                    </div>
                    <div class="promo-projects-container-parent">
                        ${new PromoTitle("Some of my projects are")}
                        <div class="promo-projects-container row col-12 mx-auto d-flex flex-column gap-2 align-items-center justify-content-center overflow-hidden">
                            ${this.promoProjectCards()}
                        </div>
                    </div>
                    <div class="promo-teacheng-container row mx-auto col-12 d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoEngTeach()}
                    </div>
                    <div class="promo-motto-container row col-12 mx-auto d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoMotto()}
                    </div>
                    <div class="promo-work-container row col-12 mx-auto d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoWork()}
                    </div>
                </div>
            </section>
        `;
    }

    private promoSkills(): string {
        return `
            ${new PromoTitle("I'm proficient in")}
        `;
    }

    private promoProjectCards(): string {
        return `
            <div class="promo-scrollable">
                <div id="promoCardContainer" class="d-flex flex-wrap gap-3 justify-content-center"></div>
            </div>
        `;
    }

    private promoVideos(): string {
        return `
            <div class="col-sm overflow-hidden px-1">${this.videoOne.render("Teaching for Life")}</div>
            <div class="col-sm overflow-hidden px-1">${this.videoTwo.render("Coding for Passion")}</div>
        `;
    }

    private promoDesc(): string {
        return `
            ${new PromoTitle("I describe myself as")}
            <div id="promo_Description" class="container-fluid w-100 px-4 py-4 my-4 d-flex flex-row gap-2">${new PromoDescription().renderPromoDesc()}</div>
        `;
    }

    private promoEngTeach(): string {
        return `
            ${new PromoTitle("Teaching English?")}
            <div id="promoTE" class="container-fluid w-100 px-4 py-4 my-4 d-flex flex-row gap-2">
                ${new PromoTeachEnglish().render()}
            </div>
        `;
    }

    private promoMotto(): string {
        return `
            ${new PromoTitle("What I believe in?")}
            <div class="promo-motto-base w-100">
                ${new PromoMotto().render()}
            </div>
        `;
    }

    private promoWork(): string {
        return `
            ${new PromoTitle("Interested in working?")}
            <div id="promoWork">
                ${new PromoInterested().render()}
            </div>
        `;
    }
}

export default Promo;
customElements.define("app-promo", Promo);