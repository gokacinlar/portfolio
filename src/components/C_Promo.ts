import * as Type from "../types";
import { PromoParts } from "../static";

export class PromoTitle {
    constructor(private titleText: string) { }

    public render(): string {
        return `
            <div class="promo-title-container text-center w-100 py-2">
                <h3 class="promo-title display-4 mb-0 fw-bolder pe-none">
                    ${this.titleText}
                </h3>
            </div>
        `;
    }

    // Stringify the output
    public toString(): string {
        return this.render();
    }
}

export class PromoDescription {
    public renderPromoDesc(): string {
        return `
            <div class="col-sm">
                <ul class="promo-featured-tabs list-unstyled d-flex flex-column gap-4 align-items-baseline">
                    <li>
                        ${this.renderTabGroupBtn("Problem Solver", "PS")}
                    </li>
                    <li>
                        ${this.renderTabGroupBtn("Progressive", "PE")}
                    </li>
                    <li>
                        ${this.renderTabGroupBtn("Practical", "PL")}
                    </li>
                    <li>
                        ${this.renderTabGroupBtn("Realistic", "RC")}
                    </li>
                </ul>
            </div>
            <div id="tabGroupDetailsLister" class="col-sm"></div>
        `;
    }

    public renderTabGroupBtn(btnText: string, dataType: string): string {
        return `
            <button class="promo-desc-tab-group-btn btn btn-lg fs-1 d-flex flex-row align-items-center justify-items-start" data-type="${dataType}">
                <span style="width: 64px">
                    <div class="progress p-vertical rounded-0">
                        <div class="progress-bar bg-warning progress-bar-animated" role="progressbar"></div>
                    </div>
                </span>
                <span>
                    ${btnText}
                </span>
            </button>
        `;
    }
}

export class PromoSkillsShowCase {
    public renderPromoSkillsShowCase(data: Type.PromoSkills): string {
        return `
            <figure class="promo-skills-fig figure d-flex flex-column align-items-center justify-content-center mb-0">
                <a href="${data.skillAnchor}" target="_blank">
                    <img src="${data.skillLogoSrc}" alt="${data.skillName}" title="${data.skillName}"
                    class="promo-skills-img figure-img rounded-4 lazyload">
                </a>
                <figcaption class="figure-caption text-center fs-4 ">${data.skillName}</figcaption>
            </figure>
        `;
    }
}

export class PromoCard {
    public renderPromoCard(data: Type.PromoCardData): string {
        return `
            <div id="promoCard" class="card d-flex flex-column align-items-center justify-content-between shadow-sm rounded-4 px-1 py-1">
                <div class="card-body d-flex flex-column align-items-center justify-content-between px-2 py-2">
                    <div class="text-center">
                        <img class="img-fluid lazyload w-50 rounded-5" src="${data.postImgSrc}" alt="${data.postName}" title="${data.postName}">
                    </div>
                    <div class="text-start">
                        <h4 class="mt-2">${data.postName}</h4>
                    </div>
                    <div>
                        <img class="post-lang-img img-fluid lazyload shadow-sm" src="${data.postLangTypeImgSrc}" alt="Written in ${data.postLangType}" title="${data.postLangType}">
                    </div>
                    <div>
                        <p class="card-text my-2">${data.postDesc}</p>
                    </div>
                    <div class="w-100">
                        <button id="promoLink" type="button" class="btn fs-4 w-100 rounded-pill shadow-sm border border-secondary-subtle" title="Navigate to ${data.postName}">
                            <a href="${data.projectLink}" target="_blank"><span class="hr-btn-text">Link</span></a>
                        </button>
                    </div>
                </div>
            </div>
    `;
    }
}

export class PromoTeachEnglish {
    public render(): string {
        return `
            <div class="col-sm">
                <div class="pt-head">
                    <p class="h1">My main profession is being an
                        <span class="mark rounded-4">English Teacher!</span></p>
                    <hr class="w-25">
                    <p class="h3 fs-3 lead fw-medium">
                        I've been teaching mostly in private schools since I graduated with my BA degree. My students range from
                        <u>elementary to high-school level</u>. I literally had the opportunity to <strong>teach students of all ages!</strong>
                    </p>
                    <hr class="w-25">
                    <p class="h3 fs-3 lead fw-medium">
                        My primary focus and principles about teaching are:
                    </p>
                </div>
                <div>
                    <ul class="list-group list-group-numbered list-group-flush fs-5 fw-medium">
                        ${this.createListContentForPrinciples()}
                    </ul>
                </div>
            </div>
            <div class="col-sm te-img-container d-flex align-self-center justify-self-center list-group list-group-numbered list-group-flush pe-none">
                <ul class="d-flex flex-row flex-wrap align-items-center justify-content-evenly p-0">
                    ${this.createImageIconsForPrinciples()}
                </ul>
            </div>
        `;
    }

    public createListContentForPrinciples(): string {
        const principles = new PromoParts().principles;
        if (!principles) {
            throw new Error("Unable to fetch content");
        }

        return principles.map(content =>
            `<li class="list-group-item"><strong>${content.title}</strong>: ${content.description}</li>`
        ).join('');
    }

    public createImageIconsForPrinciples(): string {
        const images = new PromoParts().principleImagePaths;

        return images.map(path =>
            `<li class="list-group-item"><img src="${path}" title="Icon" class="lazyload img-fluid"></li>`
        ).join("");
    }
}