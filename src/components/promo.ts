export class PromoTitle {
    constructor(private titleText: string) { }

    public render(): string {
        return `<h3 class="promo-title display-4">${this.titleText}</h3>`;
    }

    // Stringify the output
    public toString(): string {
        return this.render();
    }
}

export class PromoCard {
    constructor(private titleText: string, private descText: string, private imgSrc: string, private langImgSrc: string,
        private projectLink: string, private lang: string) { }

    public render(): string {
        return `
            <div id="promoCard" class="bg-gradient d-flex flex-column align-items-center justify-content-between shadow-sm">
                <div>
                    <h4>${this.titleText}</h4>
                </div>
                <div>
                    <img class="img-responsive img-fluid lazyload" src="${this.imgSrc}" alt="${this.titleText}" title="${this.titleText}">
                </div>
                <div>
                    <img class="img-responsive img-fluid lazyload" src="${this.langImgSrc}" alt="Written in ${this.lang}" title="${this.lang}">
                </div>
                <div>
                    <p>
                        ${this.descText}
                    </p>
                </div>
                <div class="align-self-end">
                    <button id="promoLink" type="button" class="bg-gradient btn btn-lg fs-4 d-inline-flex flex-row align-items-center rounded-4 shadow-sm
                        link-offset-2 link-underline link-underline-opacity-0" title="Navigate to ${this.titleText}">
                        <a class="" href="">
                            <span class="hr-btn-text">Link</span>
                            <i class="promo-project-link-icon bi bi-link-45deg"></i>
                        </a>
                    </button>
                </div>
            </div>
        `;
    }

    // Stringify the output
    public toString(): string {
        return this.render();
    }
}