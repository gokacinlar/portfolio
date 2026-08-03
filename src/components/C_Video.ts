interface VideoElementOptions {
    title: string;
    webmSrc: string;
    posterSrc: string;
}

export class VideoElement {
    private title: string;
    private webmSrc: string;
    private posterSrc: string;

    constructor({ title, webmSrc, posterSrc }: VideoElementOptions) {
        this.title = title;
        this.webmSrc = webmSrc;
        this.posterSrc = posterSrc;
    }

    public render(header: string): string {
        return /*html*/ `
            <div id="component_Video" class="position-relative shadow">
                <video id="promoVideo" class="promo-video rounded-5 w-100 pe-none" preload="metadata" poster="${this.posterSrc}" loading="lazy"
                    disablepictureinpicture loop muted autoplay
                    aria-labelledby="${this.title}"
                    aria-describedby="${this.title}"
                    >
                    <source src="${this.webmSrc}" type="video/webm">
                </video>
                <h4 class="position-absolute top-50 start-50 py-2 translate-middle text-center display-4 fw-bold rounded-4 text-white pe-none">
                    ${header}
                </h4>
            </div>
        `;
    }
}