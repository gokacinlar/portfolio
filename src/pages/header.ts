// Libraries
import "lazysizes";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Components
import { Template, DomEvents } from '../helper';

class Header extends HTMLElement {
    private template: Template;
    private headerTemplate: HeaderNode;
    private domEvents: DomEvents;
    constructor() {
        super();
        this.template = new Template();
        this.headerTemplate = new HeaderNode();
        this.domEvents = new DomEvents();

        const template = this.template.createTemplate(this.headerTemplate.headerItself());
        this.appendChild(template.content.cloneNode(true));
    }

    connectedCallback(): void {
        const hrBtn = document.querySelector("#hrBtn") as HTMLButtonElement;
        this.domEvents.headerRightActions(hrBtn);
        const dayNightModeSwitchingBtn = document.querySelector("#hrDayNightBtn") as HTMLButtonElement;
        this.domEvents.dayNightModeSwitching(dayNightModeSwitchingBtn, ".hr-daynight-switch-icon");
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

    private headerMiddle(): string {
        return `
            <nav>
                <ul class="header-middle-nav-links list-unstyled mb-0 d-flex flex-row gap-1">
                    <li><a href="" title="Home" class="btn header-btn-bg btn-lg rounded-5 fs-4">
                        <i class="bi bi-house-door"></i> Home</a></li>
                    <li><a href="" title="Blog" class="btn header-btn-bg btn-lg rounded-5 fs-4">
                        <i class="bi bi-journals"></i> Updates</a></li>
                    <li><a href="" title="About" class="btn header-btn-bg btn-lg rounded-5 fs-4">
                        <i class="bi bi-person-circle"></i> About</a></li>
                    <li><a href="" title="Socials" class="btn header-btn-bg btn-lg rounded-5 fs-4">
                        <i class="bi bi-share-fill"></i> Socials</a></li>
                </ul>
            </nav>
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
        `;
    }
}

export default Header;
customElements.define("app-header", Header);