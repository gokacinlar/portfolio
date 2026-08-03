import { PromoTitle, PromoDescription, PromoCard, PromoSkillsShowCase, PromoTeachEnglish, PromoMotto, PromoInterested } from "../components/C_Promo";
import { VideoElement } from "../components/C_Video";
import { Template, PromoFunctions, HorizontalMiddleMouseScroll, ScrollRevealAction, colorfulBannerName } from "../utils/helper";
import { PromoParts, Banner } from "../static";
import posts from '../assets/json/posts.json';
import skills from '../assets/json/promo_Skills.json';
import Localize from "../utils/initLocalization";
import ThreeJs from "../services/threeJs";

class Promo extends HTMLElement {
    private hmmsCleanupFunctions: (() => void)[] = [];

    constructor() {
        super();
        new Template().createTemplate(new PromoTemplate().promoTemplate(), this);
    }

    private handleThreeJsAnimation(): void {
        const scene = new ThreeJs("#threeJsAnimationContainer");
        scene.loadModel("../assets/3d/desk.glb");
    }


    connectedCallback(): void {
        // Create promo elements
        const promoFunctions = new PromoFunctions();
        promoFunctions.createPromoContent("#promoCardContainer", posts, (post) => new PromoCard().renderPromoCard(post));
        promoFunctions.createPromoContent("#promoSkillsContainer", skills, (skill) => new PromoSkillsShowCase().renderPromoSkillsShowCase(skill));
        // Create vertical tab grouping showcase
        promoFunctions.bindVerticalTabEventsAndautoCycleTabs(new PromoParts().promoTabData);

        // Store cleanup functions for HorizontalMiddleMouseScroll
        this.hmmsCleanupFunctions.push(new HorizontalMiddleMouseScroll().hmmsScroll(".promo-featured-tabs"));
        this.hmmsCleanupFunctions.push(new HorizontalMiddleMouseScroll().hmmsScroll(".promo-card-container"));

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

        // Colorful banner text
        colorfulBannerName(Banner.BANNER_ASCII, "homePageNameBannerCode");
        this.handleThreeJsAnimation();
    }

    disconnectedCallback(): void {
        // Call all stored cleanup functions when the component is disconnected
        this.hmmsCleanupFunctions.forEach(cleanup => cleanup());
        this.hmmsCleanupFunctions = []; // Clear the array
    }
}

class PromoTemplate {
    private videoOne = new VideoElement({
        title: Localize.translate("common:video:teach"),
        webmSrc: "../assets/videos/teach.webm",
        posterSrc: "../assets/videos/poster/teach.jpeg"
    });

    private videoTwo = new VideoElement({
        title: Localize.translate("common:video:code"),
        webmSrc: "../assets/videos/code.webm",
        posterSrc: "../assets/videos/poster/code.jpeg"
    });

    public promoTemplate(): string {
        return /*html*/ `
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
                            <div id="promoSkillsContainer" class="d-flex flex-row align-items-center justify-content-center gap-4 py-2"></div>
                        </div>
                    </div>
                    <div class="promo-projects-container-parent">
                        <div class="mb-4">
                            ${new PromoTitle(Localize.translate("common:projects:title"))}
                        </div>
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
                    <div class="promo-work-container row col-12 mx-auto d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.threeJsAnimationContainer()}
                    </div>
                    <div class="promo-work-container row col-12 mx-auto d-flex flex-column gap-2 align-items-center justify-content-center">
                        ${this.promoBanner()}
                    </div>
                </div>
            </section>
        `;
    }

    private promoSkills(): string {
        return /*html*/ `
            ${new PromoTitle(Localize.translate("common:skills:title"))}
        `;
    }

    private promoProjectCards(): string {
        return /*html*/ `
            <div class="promo-scrollable">
                <div id="promoCardContainer" class="promo-card-container d-flex flex-wrap gap-3 justify-content-center"></div>
            </div>
        `;
    }

    private promoVideos(): string {
        return /*html*/ `
            <div class="col-sm overflow-hidden px-1">${this.videoOne.render(Localize.translate("common:video:teach"))}</div>
            <div class="col-sm overflow-hidden px-1">${this.videoTwo.render(Localize.translate("common:video:code"))}</div>
        `;
    }

    private promoDesc(): string {
        return /*html*/ `
            ${new PromoTitle(Localize.translate("common:desc:descTitle"))}
            <div id="promo_Description" class="container-fluid w-100 d-flex flex-row overflow-hidden">${new PromoDescription().renderPromoDesc()}</div>
        `;
    }

    private promoEngTeach(): string {
        return /*html*/ `
            ${new PromoTitle(Localize.translate("common:teach:title"))}
            <div id="promoTE" class="container-fluid w-100 px-4 py-4 my-4 d-flex flex-row gap-2">
                ${new PromoTeachEnglish().render()}
            </div>
        `;
    }

    private promoMotto(): string {
        return /*html*/ `
            ${new PromoTitle(Localize.translate("common:quoteAboutEdu:title"))}
            <div class="promo-motto-base w-100">
                ${new PromoMotto().render()}
            </div>
        `;
    }

    private promoWork(): string {
        return /*html*/ `
            ${new PromoTitle(Localize.translate("common:work:title"))}
            <div id="promoWork">
                ${new PromoInterested().render()}
            </div>
        `;
    }

    private promoBanner(): string {
        return /*html*/`
            <pre id="homePageNameBanner">
                <code id="homePageNameBannerCode" class="d-flex justify-content-center align-items-center"></code>
            </pre>
        `;
    }

    private threeJsAnimationContainer(): string {
        return /*html*/ `
            <div id="threeJsAnimationContainer" class="px-3 rounded-5">
            </div>
        `;
    }
}

export default Promo;
customElements.define("app-promo", Promo);