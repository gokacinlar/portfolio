import Localize from "../utils/initLocalization";
import * as type from "../ts/types/types";
import * as iface from "../ts/interfaces/i.global";
import { HtmxControls } from "../components/M_htmx";

export const SITE_URL: string = "https://dervisoksuzoglu.xyz";

export const defaultHtmxOptions: type.HTMXOptions = {
    hxget: "",
    hxtrigger: "click",
    hxswap: "innerHTML transition:true",
    hxpushurl: true,
};

export const navLinks: iface.NavLink[] = [
    {
        href: "/index.html",
        title: Localize.translate("common:upperNavigation:home"),
        icon: "bi bi-house-door",
        htmxOptions: { ...defaultHtmxOptions, hxget: "/index.html" },
    },
    {
        href: "/idno",
        title: Localize.translate("common:upperNavigation:lifeFeed"),
        icon: "bi bi-bookshelf",
        htmxOptions: { ...defaultHtmxOptions, hxget: "/idno" },
    },
    {
        href: "/updates.html",
        title: Localize.translate("common:upperNavigation:updates"),
        icon: "bi bi-journals",
        htmxOptions: { ...defaultHtmxOptions, hxget: "/updates.html" },
    },
    {
        href: "/about.html",
        title: Localize.translate("common:upperNavigation:about"),
        icon: "bi bi-person-circle",
        htmxOptions: { ...defaultHtmxOptions, hxget: "/about.html" },
    },
];

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
            const options: type.HTMXOptions = { ...(htmxOptions ?? defaultHtmxOptions), hxget: htmxOptions?.hxget || href };

            return /*html*/`
                    <li class="w-100">
                        <a
                            href="${href}"
                            ${new HtmxControls(options).render()}
                            title="${title}"
                            class="htmx-nav-link btn header-btn-bg btn-lg rounded-5 fs-3">
                            <i class="bi ${icon}"></i> ${title}
                        </a>
                    </li>
                `;
        })
        .join("");
}
