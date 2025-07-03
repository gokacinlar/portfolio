import "./assets/scss/index.scss";
import "./assets/scss/globals.scss";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { DarkLightMode } from './helper';
import "./pages/header";
import "./pages/footer";
import "./pages/hero";
import "./pages/promo";

class HomePage extends HTMLElement {
    constructor() {
        super();
        new DarkLightMode();
    }
}

export default HomePage;
customElements.define("app-main", HomePage);