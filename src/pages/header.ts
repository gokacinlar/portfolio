import Localize from "../utils/initLocalization";
import * as iface from "../ts/interfaces/i.global";
import { Template, DarkLightMode, applyHapticsToModals } from "../utils/helper";
import { listenForBootstrapModalEventDelegation, insertModalsToDom } from "../utils/bootstrap";
import { HtmxControls } from "../components/M_htmx";
import ResponsiveNavbar from "../components/responsive/R_navbar";
import CustomWebHaptics from "../utils/webHaptics";
import {
    headerLeftIcon as sharedHeaderLeftIcon, headerMiddleContent as sharedHeaderMiddleContent,
    defaultHtmxOptions as sharedDefaultHtmxOptions,
} from "./headerShared";

let darkLightModeInstance: DarkLightMode | null = null;
let cleanupModalDelegation: (() => void) | null = null;

class Header extends HTMLElement {
    private webHaptics = CustomWebHaptics.getInstance();
    private hapticsCleanup: (() => void) | null = null;
    private pageSwitchDomReadyHandler: (() => void) | null = null;
    private pageSwitchClickCleanups: Array<() => void> = [];
    private languageSwitcherDomReadyHandler: (() => void) | null = null;
    private responsiveNavbar: ResponsiveNavbar | null = null;

    constructor() {
        super();
        new Template().createTemplate(new HeaderNode().headerItself(), this);
    }

    private handleDarkLightMode(): void {
        const dayNightModeSwitchingBtn = this.querySelector("#hrDayNightBtn") as HTMLButtonElement;

        if (!darkLightModeInstance) {
            darkLightModeInstance = DarkLightMode.getInstance();
        }
        if (dayNightModeSwitchingBtn) {
            darkLightModeInstance.dayNightModeSwitching(dayNightModeSwitchingBtn, ".hr-daynight-switch-icon");
        }
    }

    private handlePageSwitchWebHaptics(): void {
        // Clean previous if re-connected
        this.cleanupPageSwitchHaptics();

        const attach = () => {
            const htmxNavigationLinks = document.querySelectorAll(".htmx-nav-button-container") as NodeListOf<HTMLButtonElement>;
            htmxNavigationLinks.forEach((el) => {
                const handler = () => {
                    this.webHaptics.triggerHaptic("success");
                };
                el.addEventListener("click", handler);
                this.pageSwitchClickCleanups.push(() => el.removeEventListener("click", handler));
            });
        };

        this.pageSwitchDomReadyHandler = () => {
            attach();
            if (this.pageSwitchDomReadyHandler) {
                document.removeEventListener("DOMContentLoaded", this.pageSwitchDomReadyHandler);
                this.pageSwitchDomReadyHandler = null;
            }
        };

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.pageSwitchDomReadyHandler);
        } else {
            attach();
            this.pageSwitchDomReadyHandler = null;
        }
    }

    private cleanupPageSwitchHaptics(): void {
        if (this.pageSwitchDomReadyHandler) {
            document.removeEventListener("DOMContentLoaded", this.pageSwitchDomReadyHandler);
            this.pageSwitchDomReadyHandler = null;
        }
        this.pageSwitchClickCleanups.forEach((fn) => fn());
        this.pageSwitchClickCleanups = [];
    }

    private handleModalInsertion() {
        const modalArray: string = "rssModal, langSwitchModal, siteMapModal, llmsTxtModal";
        insertModalsToDom(modalArray);
    }

    private handleUtilitites(): void {
        this.hapticsCleanup = applyHapticsToModals();
        this.handleDarkLightMode();
        this.handleModalInsertion();
        this.handlePageSwitchWebHaptics();
        this.responsiveNavbar = new ResponsiveNavbar();
        this.responsiveNavbar.connectedCallback();

        // Language switcher: store DOMContentLoaded handler for cleanup
        const langHandler = () => {
            Localize.changeLanguageViaI18n("changeLngToTr", "tr");
            Localize.changeLanguageViaI18n("changeLngToEn", "en");
            if (this.languageSwitcherDomReadyHandler) {
                document.removeEventListener("DOMContentLoaded", this.languageSwitcherDomReadyHandler);
                this.languageSwitcherDomReadyHandler = null;
            }
        };
        this.languageSwitcherDomReadyHandler = langHandler;
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", this.languageSwitcherDomReadyHandler);
        } else {
            langHandler();
        }
    }

    connectedCallback(): void {
        this.handleUtilitites();

        if (!cleanupModalDelegation) {
            cleanupModalDelegation = listenForBootstrapModalEventDelegation();
        }
    }

    disconnectedCallback(): void {
        if (cleanupModalDelegation) {
            cleanupModalDelegation();
            cleanupModalDelegation = null;
        }
        if (this.hapticsCleanup) {
            this.hapticsCleanup();
            this.hapticsCleanup = null;
        }
        this.cleanupPageSwitchHaptics();
        if (this.languageSwitcherDomReadyHandler) {
            document.removeEventListener("DOMContentLoaded", this.languageSwitcherDomReadyHandler);
            this.languageSwitcherDomReadyHandler = null;
        }
        if (this.responsiveNavbar) {
            this.responsiveNavbar.disconnectedCallback();
            this.responsiveNavbar = null;
        }
        // Note: darkLightModeInstance is module-singleton; destroy only if we own it
        // and header is being permanently removed. Keep listener cleanup lightweight.
        if (darkLightModeInstance) {
            // Do not null the singleton here to avoid re-creation churn on nav,
            // but ensure click handler is idempotent via DarkLightMode's own cleanup
            // on next dayNightModeSwitching. If header is destroyed permanently,
            // uncomment the next two lines:
            // darkLightModeInstance.destroy();
            // darkLightModeInstance = null;
        }
    }
}

export class HeaderNode {
    public static headerLeftIcon(): string {
        return sharedHeaderLeftIcon();
    }

    public static headerMiddleContent(): string {
        return sharedHeaderMiddleContent();
    }

    private static readonly defaultHtmxOptions = sharedDefaultHtmxOptions;

    public headerItself(): string {
        return /*html*/ `
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

    public static headerMiddle(): string {
        return /*html*/ `
            <nav id="headerM">
                <ul class="header-middle-nav-links list-unstyled mb-0 d-flex flex-row gap-1 text-truncate">
                    ${HeaderNode.headerMiddleContent()}
                </ul>
            </nav>
        `;
    }

    private static readonly primaryBtn: iface.NavLink = {
        href: "/work.html",
        title: Localize.translate("common:hero:buttonTitles:workHire"),
        icon: "bi bi-star-half text-black fw-bold pulsate-fwd",
        htmxOptions: { ...HeaderNode.defaultHtmxOptions, hxget: "/work.html" },
    }

    public static headerHireBtn(): string {
        return /*html*/ `
            <a id="hrBtn" type="button" class="bee-color-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-2"
                title="${this.primaryBtn.title}" href="${this.primaryBtn.href}"
                ${new HtmxControls(this.primaryBtn.htmxOptions ?? this.defaultHtmxOptions).render()}>
                <i class="${this.primaryBtn.icon}"></i>
                <span class="hr-btn-text">${Localize.translate("common:hero:buttons:workWMe")}</span>
            </a>
        `;
    }

    private static headerEtc(): string {
        return /*html*/ `
            <div class="d-flex flex-row align-items-center justify-content-center flex-1 gap-2">
                <button id="hrDayNightBtn" type="button" class="bee-color-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center gap-1"
                    title="${Localize.translate("common:header:dayNight")}">
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
        return /*html*/ `
            <button id="hrLangSwitchBtn" type="button" class="bee-color-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center gap-1 modal-trigger"
                role="button" title="${Localize.translate("common:header:changeLanguage")}" data-modal="langSwitchModal">
                <i class="bi bi-translate text-black fw-bold"></i>
            </button>
        `;
    }

    public initDynamicLanguageSwitcher(): void {
        const handler = () => {
            Localize.changeLanguageViaI18n("changeLngToTr", "tr");
            Localize.changeLanguageViaI18n("changeLngToEn", "en");
        };
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", handler, { once: true });
        } else {
            handler();
        }
    }
}

export default Header;
customElements.define("app-header", Header);