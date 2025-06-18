// Crucial imports
import "./assets/css/index.css";
import "./assets/css/globals.css";
// Libraries
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
// Components
import { Template, DarkLightMode } from './helper';
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