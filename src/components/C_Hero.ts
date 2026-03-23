export class HeroImageWithLink {
    public render(title: string, id: string, href: string, src: string, srcset: string): string {
        return /*html*/ `
            <a id="${id}" href="${href}" class="d-flex justify-content-center link-offset-2 link-underline link-underline-opacity-0 w-100">
                <img
                    class="hero-logo img-fluid lazyload"
                    src="${src}"
                    srcset="${srcset}"
                    sizes="(max-width: 600px) 256px, (max-width: 960px) 512px, 1024px"
                    alt="${title}"
                    title="${title}"
                    height="auto"
                    loading="lazy"
                    decoding="async"
                    />
            </a>
        `;
    }

    // Stringify the output
    public toString(): string {
        return this.render("Derviş Öksüzoğlu", "heroLogoBg", "https://www.github.com/gokacinlar",
            "../assets/images/static/webp/logo.webp", "../assets/images/static/webp/logo_256x256.webp 256w, ../assets/images/static/webp/logo_512x512.webp 512w, ../assets/images/static/webp/logo.webp 1024w");
    }
}