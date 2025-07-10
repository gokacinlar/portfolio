// CSS & SCSS
import "./assets/scss/index.scss";
import "./assets/scss/globals.scss";
// CSS Framework & Framework-related
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
// Libraries
import "lazysizes";
// Components & Helper functions
import { DarkLightMode } from './helper';
// Pages
import "./pages/header";
import "./pages/footer";
import "./pages/hero";
import "./pages/promo";
import "./pages/about";

class HomePage extends HTMLElement {
    constructor() {
        super();
        new DarkLightMode();
    }
}

export default HomePage;
customElements.define("app-main", HomePage);