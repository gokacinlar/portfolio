import { Routes, defaultHtmxOptions, NavLinkHtmxOptions } from "../utils/helpers/routes";
import * as iface from "../ts/interfaces/i.global";
import { HtmxControls } from "../components/M_htmx";

export const SITE_URL: string = "https://dervisoksuzoglu.xyz";
export { Routes, defaultHtmxOptions };

export const navLinks = ((): iface.NavLink[] => [
    {
        href: Routes.HOME,
        title: "Home",
        icon: "bi bi-house-door",
        htmxOptions: NavLinkHtmxOptions[Routes.HOME],
    },
    {
        href: Routes.LIFE_FEED,
        title: "Life Feed",
        icon: "bi bi-bookshelf",
        htmxOptions: NavLinkHtmxOptions[Routes.LIFE_FEED],
    },
    {
        href: Routes.GALLERY,
        title: "Gallery",
        icon: "bi bi-images",
        htmxOptions: NavLinkHtmxOptions[Routes.GALLERY],
    },
    {
        href: Routes.UPDATES,
        title: "Updates",
        icon: "bi bi-journals",
        htmxOptions: NavLinkHtmxOptions[Routes.UPDATES],
    },
    {
        href: Routes.ABOUT,
        title: "About",
        icon: "bi bi-person-circle",
        htmxOptions: NavLinkHtmxOptions[Routes.ABOUT],
    },
])();

export function headerLeftIcon(): string {
    return /*html*/ `
            <a href="${SITE_URL}" hreflang="x-default">
                <img
                    class="header-logo img-fluid img-responsive lazyload"
                    src="../assets/images/static/webp/logo.webp"
                    srcset="../assets/images/static/webp/logo_256x256.webp 256w, ../assets/images/static/webp/logo_512x512.webp 512w,
                    ../assets/images/static/webp/logo.webp 1024w"
                    sizes="(max-width: 600px) 256px, (max-width: 960px) 512px, 1024px"
                    alt="Derviş Öksüzoğlu"
                    title="Derviş Öksüzoğlu"
                    height="auto"
                    loading="lazy"
                    decoding="async"
                    />
            </a>
        `;
}

export function headerMiddleContent(): string {
    return navLinks
        .map(({ href, title, icon, htmxOptions }) => {
            return /*html*/`
                    <li class="w-100">
                        <a
                            href="${href}"
                            ${new HtmxControls(htmxOptions ?? defaultHtmxOptions).render()}
                            title="${title}"
                            class="htmx-nav-link btn header-btn-bg btn-lg rounded-5 fs-3">
                            <i class="bi ${icon}"></i> ${title}
                        </a>
                    </li>
                `;
        })
        .join("");
}