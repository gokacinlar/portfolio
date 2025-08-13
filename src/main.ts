// CSS & SCSS
import "./assets/scss/index.scss";
import "./assets/scss/globals.scss";
// CSS Framework & Framework-related
import "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Libraries
import "lazysizes";
// Components & Helper functions
import { DarkLightMode } from "./helper";
import GoogleAnalytics from "./utils/gTag";
// Pages
import "./pages/header";
import "./pages/footer";
import "./pages/hero";
import "./pages/promo";
import "./pages/about";
import "./pages/blog";

class HomePage extends HTMLElement {
    constructor() {
        super();
        this.connectedCallback();
    }

    connectedCallback(): void {
        new DarkLightMode();
        new GoogleAnalytics().trackPage();
    }
}

export default HomePage;
customElements.define("app-main", HomePage);