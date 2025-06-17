import * as Type from "../types"

export class PromoTitle {
    constructor(private titleText: string) { }

    public render(): string {
        return `<h3 class="promo-title display-1">${this.titleText}</h3>`;
    }

    // Stringify the output
    public toString(): string {
        return this.render();
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
                        <img class="img-responsive img-fluid lazyload" src="${data.postImgSrc}" alt="${data.postName}" title="${data.postName}">
                    </div>
                    <div>
                        <img class="img-responsive img-fluid lazyload" src="${data.postLangTypeImgSrc}" alt="Written in ${data.postLangType}" title="${data.postLangType}">
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