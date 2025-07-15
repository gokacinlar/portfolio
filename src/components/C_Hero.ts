export class HeroImageWithLink {
    public render(title: string, id: string, href: string, src: string, srcset: string): string {
        return `
            <a id="${id}" href="${href}" class="d-flex justify-content-center link-offset-2 link-underline link-underline-opacity-0">
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
            "../assets/images/static/logo.jpg", "../assets/images/static/logo_256x256.jpg 256w, ../assets/images/static/logo_512x512.jpg 512w, ../assets/images/static/logo.jpg 1024w");
    }
}