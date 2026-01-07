// CSS & SCSS
import "./assets/scss/index.scss";
import "./assets/scss/globals.scss";
// CSS Framework & Framework-related
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
// Libraries
import "lazysizes";
// Utilieis
import { DarkLightMode } from "./utils/helper";
import GoogleAnalytics from "./utils/gTag";
import EffectiveCaching from "./utils/cache";
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

class HomePage extends HTMLElement {
    constructor() {
        super();
    };

    connectedCallback(): void {
        new DarkLightMode();
        new GoogleAnalytics().trackPage();
        new EffectiveCaching().ensureCache();
    }
}

export default HomePage;
customElements.define("app-main", HomePage)