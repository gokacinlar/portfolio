import * as Type from "../types"

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
                <span>
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
            <figure class="promo-skills-fig figure d-flex flex-column justify-content-between">
                <a href="${data.skillAnchor}" target="_blank">
                    <img src="${data.skillLogoSrc}" alt="${data.skillName}" title="${data.skillName}"
                    class="promo-skills-img figure-img rounded-4 lazyload">
                </a>
                <figcaption class="figure-caption text-center fs-4 mt-auto">${data.skillName}</figcaption>
            </figure>
        `;
    }
}

export class PromoContact {
    public renderPromoContacts(data: Type.PromoSocials): string {
        return `
            <div class="js-tilt" data-tilt data-tilt-full-page-listening">
                <figure class="promo-socials-fig figure d-flex flex-column align-items-center justify-content-between">
                    <a href="${data.socialLink}" target="_blank">
                        <img src="${data.socialLogo}" alt="${data.socialName}" title="${data.socialName}"
                        class="figure-img img-fluid rounded-4 lazyload px-2 py-2">
                    </a>
                    <figcaption class="figure-caption text-center fs-4 mt-auto">${data.socialName}</figcaption>
                </figure>
            </div>
        `;
    }
}

export class PromoCard {
    public renderPromoCard(data: Type.PromoCardData): string {
        return `
            <div id="promoCard" class="d-flex flex-column align-items-center justify-content-between shadow-sm">
                <div class="w-100 h-100 d-flex flex-column justify-content-between px-2 py-2">
                    <div>
                        <img class="img-fluid lazyload" src="${data.postImgSrc}" alt="${data.postName}" title="${data.postName}">
                    </div>
                    <div>
                        <h4 class="text-center">${data.postName}</h4>
                    </div>
                    <div>
                        <img class="img-fluid lazyload" src="${data.postLangTypeImgSrc}" alt="Written in ${data.postLangType}" title="${data.postLangType}">
                    </div>
                    <div>
                        <p>${data.postDesc}</p>
                    </div>
                </div>
                <div class="align-self-end">
                    <button id="promoLink" type="button" class="bg-gradient btn btn-lg fs-4 d-inline-flex flex-row align-items-center rounded-4 shadow-sm border border-4" title="Navigate to ${data.postName}">
                        <a href="${data.projectLink}">
                            <span class="hr-btn-text">Link</span>
                            <i class="promo-project-link-icon bi bi-link-45deg"></i>
                        </a>
                    </button>
                </div>
            </div>
    `;
    }
}