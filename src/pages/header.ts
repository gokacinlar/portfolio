import Localize from "../utils/initLocalization";
import * as Type from "../types/types";
import { Template, DarkLightMode } from "../utils/helper";
import { renderModal, listenForBootstrapModalEventDelegation } from "../utils/bootstrap";
import { HtmxControls } from "../components/M_htmx";
import ResponsiveNavbar from "../components/responsive/R_navbar";
import { ModalList } from "../static";

let darkLightModeInstance: DarkLightMode | null = null;
let cleanupModalDelegation: (() => void) | null = null;

class Header extends HTMLElement {
    constructor() {
        super();
        new Template().createTemplate(new HeaderNode().headerItself(), this);
    }

    connectedCallback(): void {
        const dayNightModeSwitchingBtn = this.querySelector("#hrDayNightBtn") as HTMLButtonElement;
        if (!darkLightModeInstance) {
            darkLightModeInstance = new DarkLightMode();
        }
        darkLightModeInstance.dayNightModeSwitching(dayNightModeSwitchingBtn, ".hr-daynight-switch-icon");
        new ResponsiveNavbar().connectedCallback();
        new HeaderNode().initDynamicLanguageSwitcher();

        if (!cleanupModalDelegation) {
            cleanupModalDelegation = listenForBootstrapModalEventDelegation();
        }
    }

    disconnectedCallback(): void {
        if (cleanupModalDelegation) {
            cleanupModalDelegation();
            cleanupModalDelegation = null;
        }
    }
}

interface NavLink {
    href: string;
    title: string;
    icon: string;
    htmxOptions?: Type.HTMXOptions;
}

export class HeaderNode {
    constructor() { };
    private static readonly SITE_URL: string = "https://dervisoksuzoglu.com.tr";

    public headerItself(): string {
        return `
            <nav class="m-1 px-2 py-2">
                <ul class="list-unstyled mb-0 d-flex flex-row align-items-center justify-content-between position-relative">
                    <li class="d-inline-flex header-left">
                        ${HeaderNode.headerLeftIcon()}
                    </li>
                    <li class="position-absolute top-50 start-50 translate-middle">
                        ${HeaderNode.headerMiddle()}
                    </li>
                    <li class="header-right d-flex flex-row align-items-center gap-2">
                        ${HeaderNode.headerHireBtn()}
                        ${HeaderNode.headerEtc()}
                    </li>
                </ul>
            </nav>
        `;
    }

    public static headerLeftIcon(): string {
        return `
            <a href="${HeaderNode.SITE_URL}">
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

    public static headerMiddle(): string {
        return `
            <nav id="headerM">
                <ul class="header-middle-nav-links list-unstyled mb-0 d-flex flex-row gap-1 text-truncate">
                    ${HeaderNode.headerMiddleContent()}
                </ul>
            </nav>
        `;
    }

    private static readonly defaultHtmxOptions: Type.HTMXOptions = {
        hxget: "",
        hxtrigger: "click",
        hxswap: "innerHTML",
        hxpushurl: true,
    };

    private static readonly navLinks: NavLink[] = [
        {
            href: "/index.html",
            title: Localize.translate("common:upperNavigation:home"),
            icon: "bi bi-house-door",
            htmxOptions: { ...HeaderNode.defaultHtmxOptions, hxget: "/index.html" },
        },
        {
            href: "/updates.html",
            title: Localize.translate("common:upperNavigation:updates"),
            icon: "bi bi-journals",
            htmxOptions: { ...HeaderNode.defaultHtmxOptions, hxget: "/updates.html" },
        },
        {
            href: "/about.html",
            title: Localize.translate("common:upperNavigation:about"),
            icon: "bi bi-person-circle",
            htmxOptions: { ...HeaderNode.defaultHtmxOptions, hxget: "/about.html" },
        }
    ];

    public static headerMiddleContent(): string {
        return HeaderNode.navLinks
            .map(({ href, title, icon, htmxOptions }) => `
                <li class="w-100">
                    <a
                        href="${href}"
                        ${new HtmxControls(htmxOptions ?? HeaderNode.defaultHtmxOptions).render()}
                        title="${title}"
                        class="btn header-btn-bg btn-lg rounded-5 fs-4 w-100">
                        <i class="bi ${icon}"></i> ${title}
                    </a>
                </li>
                `).join("");
    }

    private static readonly primaryBtn: NavLink = {
        href: "/work.html",
        title: Localize.translate("common:hero:buttonTitles:workHire"),
        icon: "bi bi-star-half text-black fw-bold pulsate-fwd",
        htmxOptions: { ...HeaderNode.defaultHtmxOptions, hxget: "/work.html" },
    }

    public static headerHireBtn(): string {
        return `
            <a id="hrBtn" type="button" class="header-btn-bg-important bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-2"
                title="${this.primaryBtn.title}" href="${this.primaryBtn.href}"
                ${new HtmxControls(this.primaryBtn.htmxOptions ?? this.defaultHtmxOptions).render()}>
                <i class="${this.primaryBtn.icon}"></i>
                <span class="hr-btn-text">${Localize.translate("common:hero:buttons:workWMe")}</span>
            </a>
        `;
    }

    private static headerEtc(): string {
        return `
            <div class="d-flex flex-row align-items-center justify-content-center flex-1 gap-2">
                <button id="hrDayNightBtn" type="button" class="header-day-night-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center gap-1"
                    title="Change Day/Night Mode">
                    <i class="hr-daynight-switch-icon bi bi-sun text-black fw-bold"></i>
                </button>
                ${HeaderNode.headerLangSwitch()}
            </div>
            <div id="headerResponsive">
                ${new ResponsiveNavbar().responsiveMenuToggleButton()}
            </div>
        `;
    }

    private static headerLangSwitch(): string {
        return `
            <button id="hrLangSwitchBtn" type="button" class="header-lang-switch-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center gap-1 modal-trigger"
                role="button" title="Change Site Language" data-modal="langSwitchModal">
                <i class="bi bi-translate text-black fw-bold"></i>
            </button>
            ${renderModal(ModalList.MODALS.filter(modal => modal.id === "langSwitchModal"))}
        `;
    }

    public initDynamicLanguageSwitcher() {
        document.addEventListener("DOMContentLoaded", () => {
            Localize.changeLanguageViaI18n("changeLngToTr", "tr");
            Localize.changeLanguageViaI18n("changeLngToEn", "en");
        });
    }
}

export default Header;
customElements.define("app-header", Header);