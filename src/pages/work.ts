import { Template } from "../utils/helper";
import Localize from "../utils/initLocalization";
import { WorkCard, WorkFeaturedSection } from "../components/C_Work";
import workEnglishData from "../assets/json/work-english.json";
import workProgrammingData from "../assets/json/work-programming.json";
import featuredPlansData from "../assets/json/work-featured.json";
import type * as iFace from "../ts/interfaces/i.global";

class WorkPage extends HTMLElement {
    constructor() {
        super();
        new Template().createTemplate(new WorkTemplate().template(), this);
    }

    connectedCallback(): void { }

    disconnectedCallback(): void { }
}

class WorkTemplate {
    private featuredSection = new WorkFeaturedSection();
    private workCard = new WorkCard();

    public template(): string {
        return /*html*/ `
            <section id="mainWork">
                <div class="container text-center h-100">
                    <div class="row gy-3 gx-3 align-items-center h-100">
                        <div class="col-12 col-md-6 col-lg-6">
                            <h1 class="display-1 text-start fw-medium pe-none"><mark class="px-4 py-1 rounded-end-5">${Localize.translate("common:workPage:hireMe")}</mark> ${Localize.translate("common:workPage:orSeePlans")}</h1>
                        </div>
                        <div class="col-12 col-md-6 col-lg-6">
                            <a href="#featuredPlans" id="workScrollDownBtn" class="btn btn-lg rounded-5 shadow-sm fw-medium fs-2 mx-auto d-flex flex-row align-items-center justify-content-center gap-2" title="${Localize.translate("common:workPage:scrollDown")}">
                                <span class="work-scroll-down-indicator">${Localize.translate("common:workPage:seePlans")}</span>
                                <i class="work-scroll-down-icon bi bi-arrow-down-circle-fill fs-1"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
            ${this.featured()}
            <div class="container-fluid px-2 px-md-3">
                <div class="individual-plan-title text-center mb-3 px-3 py-4 rounded-5 shadow-sm">
                    <h2 class="display-6 fw-bold mb-1"><i class="bi bi-patch-question"></i> ${Localize.translate("common:workPage:individualPlan:title") !== "common:workPage:individualPlan:title" ? Localize.translate("common:workPage:individualPlan:title") : "Do you need individual plan?"}</h2>
                    <p class="lead text-body-secondary mb-0">${Localize.translate("common:workPage:individualPlan:subtitle") !== "common:workPage:individualPlan:subtitle" ? Localize.translate("common:workPage:individualPlan:subtitle") : "Browse individual options for English & Development"}</p>
                </div>
            </div>
            <article id="buyOptions" class="px-2 py-2 mx-2 mx-md-3 my-3 rounded-5 shadow-sm d-flex flex-column" style="min-height: 400px;">
                <div class="container-fluid h-100 px-2 py-2 d-flex flex-column">
                    <div class="row mx-2 flex-shrink-0">
                        ${this.tabsNav()}
                    </div>
                    <div class="row mx-2 mt-3 flex-grow-1 overflow-hidden d-flex flex-column" style="min-height: 0;">
                        <div class="col-12 flex-grow-1 d-flex flex-column p-0" style="min-height: 0;">
                            ${this.tabsContent()}
                        </div>
                    </div>
                </div>
            </article>
            ${this.stillUnsure()}
        `;
    }

    private featured(): string {
        return this.featuredSection.render(featuredPlansData as unknown as iFace.FeaturedPlanConfig[]);
    }

    private tabsNav(): string {
        return /*html*/ `
            <ul class="nav nav-pills nav-fill px-0 gap-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active rounded-5 fs-2 fw-medium shadow-sm" aria-current="page" data-bs-toggle="tab" data-bs-target="#englishOptions" type="button" role="tab" aria-controls="englishOptions" aria-selected="true" id="forEnglish">${Localize.translate("common:workPage:forEnglish")}</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link rounded-5 fs-2 fw-medium shadow-sm" data-bs-toggle="tab" data-bs-target="#programmingOptions" type="button" role="tab" aria-controls="programmingOptions" aria-selected="false" id="forProgramming">${Localize.translate("common:workPage:forProgramming")}</button>
                </li>
            </ul>
        `;
    }

    private tabsContent(): string {
        return /*html*/ `
            <div id="optionsContent" class="bg-secondary-subtle px-2 px-md-3 py-3 rounded-5 shadow-sm h-100 flex-grow-1 overflow-hidden d-flex flex-column work-no-scrollbar" style="min-height: 0;">
                <div class="tab-content flex-grow-1 d-flex flex-column overflow-hidden" style="min-height: 0;">
                    <div class="tab-pane fade show active flex-grow-1 overflow-y-auto overflow-x-hidden work-no-scrollbar" 
                        id="englishOptions" 
                        role="tabpanel" 
                        aria-labelledby="englishOptions" 
                        style="min-height: 0;">
                        <div class="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 px-2 py-2 align-items-stretch">
                            ${this.englishCards()}
                        </div>
                    </div>
                    <div class="tab-pane fade flex-grow-1 overflow-y-auto overflow-x-hidden work-no-scrollbar" 
                        id="programmingOptions" 
                        role="tabpanel" 
                        aria-labelledby="programmingOptions" 
                        style="min-height: 0;">
                        <div class="row g-3 g-md-4 row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 px-2 py-2 align-items-stretch">
                            ${this.programmingCards()}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    private englishCards(): string {
        const data = workEnglishData as unknown as iFace.EnglishWorkBuyingOptions[];
        if (!data.length) return "";
        return data.map((item) => this.workCard.render(item)).join("");
    }

    private programmingCards(): string {
        const data = workProgrammingData as unknown as iFace.EnglishWorkBuyingOptions[];
        if (!data.length) {
            const fallback = Localize.translate("common:workPage:comingSoon");
            const msg = fallback === "common:workPage:comingSoon" ? "Coming soon..." : fallback;
            return /*html*/ `<div class="col-12"><div class="alert alert-info rounded-4 text-center mb-0" 
                                role="alert">${msg}</div>
                             </div>`;
        }
        return data.map((item) => this.workCard.render(item)).join("");
    }

    private stillUnsure(): string {
        const title = Localize.translate("common:workPage:stillUnsure:title");
        const subtitle = Localize.translate("common:workPage:stillUnsure:subtitle");
        const description = Localize.translate("common:workPage:stillUnsure:description");
        const cta = Localize.translate("common:workPage:stillUnsure:cta");
        const ctaTitle = Localize.translate("common:workPage:stillUnsure:ctaTitle");
        const note = Localize.translate("common:workPage:stillUnsure:note");
        const waUrl = "https://wa.me/905000000000?text=Hi%20I%27m%20still%20unsure%20which%20plan%20fits%20me%20—%20could%20you%20help%3F";

        const displayTitle = title === "common:workPage:stillUnsure:title" ? "Still unsure?" : title;
        const displaySubtitle = subtitle === "common:workPage:stillUnsure:subtitle" ? "Let's find the right fit together" : subtitle;
        const displayDesc = description === "common:workPage:stillUnsure:description" ? "Not sure which plan suits you? Send me a quick message. I'll help you choose in minutes, no pressure." : description;
        const displayCta = cta === "common:workPage:stillUnsure:cta" ? "Chat on WhatsApp" : cta;
        const displayCtaTitle = ctaTitle === "common:workPage:stillUnsure:ctaTitle" ? "Chat on WhatsApp" : ctaTitle;
        const displayNote = note === "common:workPage:stillUnsure:note" ? "Usually replies within an hour • No spam • No commitment" : note;

        return /*html*/ `
            <section id="stillUnsure" class="container-fluid px-2 px-md-3 py-3 py-md-4">
                <div class="still-unsure-card rounded-5 px-3 py-4 px-md-5 py-md-5 shadow-sm d-flex flex-column align-items-center justify-content-center text-center gap-3">
                    <div class="still-unsure-icon-wrap d-flex align-items-center justify-content-center rounded-circle">
                        <i class="bi bi-whatsapp still-unsure-icon fs-1" aria-hidden="true"></i>
                    </div>
                    <div>
                        <h2 class="display-6 fw-bold mb-1"><i class="bi bi-emoji-smile-upside-down"></i> ${displayTitle}</h2>
                        <p class="still-unsure-subtitle fs-5 fw-medium text-body-secondary mb-0">${displaySubtitle}</p>
                    </div>
                    <p class="still-unsure-desc lead fs-5 text-body-secondary mx-auto mb-1" style="max-width: 48ch;">${displayDesc}</p>
                    <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-lg still-unsure-cta rounded-pill px-4 py-3 fw-semibold d-inline-flex align-items-center justify-content-center gap-2" title="${displayCtaTitle}" aria-label="${displayCtaTitle}">
                        <i class="bi bi-whatsapp" aria-hidden="true"></i>
                        <span>${displayCta}</span>
                        <i class="bi bi-arrow-right" aria-hidden="true"></i>
                    </a>
                    <small class="still-unsure-note text-body-secondary">${displayNote}</small>
                </div>
            </section>
        `;
    }
}

customElements.define("app-work", WorkPage);
export default WorkPage;