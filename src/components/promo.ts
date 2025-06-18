import * as Type from "../types"

export class PromoTitle {
    constructor(private titleText: string) { }

    public render(): string {
        return `
            <h3 class="promo-title display-1 fw-bolder pe-none">
                ${this.titleText}
            </h3>
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
        `;
    }
}

export class PromoSkillsShowCase {
    public renderPromoSkillsShowCase(data: Type.PromoSkills): string {
        return `
            <figure class="promo-skills-fig figure d-flex flex-column justify-content-between">
                <a href="${data.skillAnchor}" target="_blank">
                    <img src="${data.skillLogoSrc}" alt="${data.skillName}" title="${data.skillName}"
                    class="promo-skills-img figure-img img-fluid rounded-4 lazyload">
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
            <div id="promoCard" class="bg-gradient d-flex flex-column align-items-center justify-content-between shadow-sm">
                <div class="w-100 h-100 d-flex flex-column justify-content-between px-2 py-2">
                    <div>
                        <h4 class="text-center">${data.postName}</h4>
                    </div>
                    <div>
                        <img class="img-fluid lazyload" src="${data.postImgSrc}" alt="${data.postName}" title="${data.postName}">
                    </div>
                    <div>
                        <img class="img-fluid lazyload" src="${data.postLangTypeImgSrc}" alt="Written in ${data.postLangType}" title="${data.postLangType}">
                    </div>
                    <div>
                        <p>${data.postDesc}</p>
                    </div>
                </div>
                <div class="align-self-end">
                    <button id="promoLink" type="button" class="bg-gradient btn btn-lg fs-4 d-inline-flex flex-row align-items-center rounded-4 shadow-sm
                        link-offset-2 link-underline link-underline-opacity-0" title="Navigate to ${data.postName}">
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