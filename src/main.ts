// CSS & SCSS
import "./assets/scss/index.scss";
import "./assets/scss/globals.scss";
// CSS Framework & Framework-related
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.js";
import "bootstrap-icons/font/bootstrap-icons.css";
// Libraries
import "lazysizes";
// Utilieis
import { DarkLightMode } from "./utils/helper";
import GoogleAnalytics from "./utils/gTag";
import EffectiveCaching from "./utils/cache";
import { listenForBootstrapModalEventDelegation } from "./utils/bootstrap";
// Pages
import "./pages/header";
import "./pages/footer";
import "./pages/hero";
import "./pages/promo";
import "./pages/about";
import "./pages/blog";
import "./pages/work.ts";
// My Own Components
import "./components/G_Maintenance";
import "./components/M_ScrollToTopButton";
import "./components/M_Hero";

let darkLightModeInstance: DarkLightMode | null = null;
let cleanupModalDelegation: (() => void) | null = null;

class HomePage extends HTMLElement {
    constructor() {
        super();
    };

    connectedCallback(): void {
        if (!darkLightModeInstance) {
            darkLightModeInstance = new DarkLightMode();
        }
        new GoogleAnalytics().trackPage();
        new EffectiveCaching().ensureCache();

        // Ensure modal delegation listener is set up only once globally
        if (!cleanupModalDelegation) {
            cleanupModalDelegation = listenForBootstrapModalEventDelegation();
        }
    }

    disconnectedCallback(): void {
        // Perform global cleanup if the main app component is ever disconnected
        if (darkLightModeInstance) {
            darkLightModeInstance.destroy();
            darkLightModeInstance = null;
        }
        if (cleanupModalDelegation) {
            cleanupModalDelegation();
            cleanupModalDelegation = null;
        }
    }
}

export default HomePage;
customElements.define("app-main", HomePage)