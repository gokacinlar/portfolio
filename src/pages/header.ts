import * as Type from "../types";
// Components
import { Template, DarkLightMode } from '../helper';
import { HtmxControls } from "../components/M_htmx";
import ResponsiveNavbar from '../components/responsive/R_navbar';

class Header extends HTMLElement {
    constructor() {
        super();
        const template = new Template().createTemplate(new HeaderNode().headerItself());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        const dayNightModeSwitchingBtn = document.querySelector("#hrDayNightBtn") as HTMLButtonElement;
        new DarkLightMode().dayNightModeSwitching(dayNightModeSwitchingBtn, ".hr-daynight-switch-icon");
        const responsiveNavbarMode = new ResponsiveNavbar().connectedCallback();
    }
}

export class HeaderNode {
    public headerItself(): string {
        return `
            <nav class="m-1 px-2 py-2">
                <ul class="list-unstyled mb-0 d-flex flex-row align-items-center justify-content-between position-relative">
                    <li>
                        <section class="d-inline-flex header-left">
                            ${this.headerLeft()}
                        </section>
                    </li>
                    <li>
                        <section class="position-absolute top-50 start-50 translate-middle">
                            ${this.headerMiddle()}
                        </section>
                    </li>
                    <li>
                        <section class="header-right d-flex flex-row align-items-center gap-2">
                            ${this.headerRight()}
                        </section>
                    </li>
                </ul>
            </nav>
        `;
    }

    public headerLeft(): string {
        return `
            <a href="">
                <img
                    class="header-logo img-fluid img-responsive lazyload"
                    src="../assets/images/static/logo.jpg"
                    srcset="../assets/images/static/logo_256x256.jpg 256w, ../assets/images/static/logo_512x512.jpg 512w,
                    ../assets/images/static/logo.jpg 1024w"
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

    public headerMiddle(): string {
        return `
            <nav id="headerM">
                <ul class="header-middle-nav-links list-unstyled mb-0 d-flex flex-row gap-1">
                    ${this.headerMiddleContent()}
                </ul>
            </nav>
        `;
    }

    private htmxOptions: Type.HTMXOptions[] = [
        {
            hxget: "/index.html",
            hxtrigger: "click",
            hxswap: "innerHTML",
            hxpushurl: "true",
        },
        {
            hxget: "/about.html",
            hxtrigger: "click",
            hxswap: "innerHTML",
            hxpushurl: "true",
        },
        {
            hxget: "/index.html",
            hxtrigger: "click",
            hxswap: "innerHTML",
            hxpushurl: "true",
        },
    ];

    public headerMiddleContent(): string {
        return `
            <li><a
                href="/index.html"
                ${new HtmxControls(this.htmxOptions[0]).render()}
                title="Home" class="btn header-btn-bg btn-lg rounded-5 fs-4"><i class="bi bi-house-door"></i> Home</a></li>
            <li><a href="" title="Blog" class="btn header-btn-bg btn-lg rounded-5 fs-4"><i class="bi bi-journals"></i> Updates</a></li>
            <li><a
                href="/about.html"
                ${new HtmxControls(this.htmxOptions[1]).render()}
                title="About" class="btn header-btn-bg btn-lg rounded-5 fs-4"><i class="bi bi-person-circle"></i> About</a></li>
        `;
    }

    private headerRight(): string {
        return `
            <button id="hrBtn" type="button" class="header-btn-bg-important bg-gradient btn btn-lg rounded-5 fs-4 shadow-md d-flex flex-row align-items-center gap-2"
                title="Proceed to hire me for your web projects.">
                <i class="bi bi-star-half text-black fw-bold pulsate-fwd"></i>
                <span class="hr-btn-text">Work w/me!</span>
            </button>
            <button id="hrDayNightBtn" type="button" class="header-day-night-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-md d-flex flex-row align-items-center gap-1"
                title="Change Day/Night Mode">
                <i class="hr-daynight-switch-icon bi bi-sun text-black fw-bold"></i>
            </button>
            <div id="headerResponsive">
                ${new ResponsiveNavbar().responsiveMenuToggleButton()}
            </div>
        `;
    }
}

export default Header;
customElements.define("app-header", Header);