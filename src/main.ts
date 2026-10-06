// CSS & SCSS
import "./assets/scss/index.scss";
import "./assets/scss/globals.scss";
// CSS Framework & Framework-related
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as bootstrap from "bootstrap";
(window as any).bootstrap = bootstrap;
// Libraries
import "lazysizes";
import * as OfflinePluginRuntime from "offline-plugin/runtime";
// Utilities
import { DarkLightMode } from "./utils/helper";
import GoogleAnalytics from "./utils/gTag";
import GetSiteVersionNumber from "./utils/webScraper";
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
import "./components/M_link";
import "./components/M_image";
import "./components/D_Login";

let darkLightModeInstance: DarkLightMode | null = null;
// Use singleton to avoid duplicate MediaQuery listeners (header also uses DarkLightMode)
function getSharedDarkLightMode(): DarkLightMode {
    if (!darkLightModeInstance) {
        darkLightModeInstance = DarkLightMode.getInstance();
    }
    return darkLightModeInstance;
}

function registerServiceWorker(): void {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/worker.js")
            .catch((error: unknown) => {
                console.error("Service worker registration failed:", error);
            });
    }
}

function registerOfflinePlugin() {
    OfflinePluginRuntime.install({
        onUpdateReady: () => OfflinePluginRuntime.applyUpdate(),
        onUpdated: () => location.reload()
    });
}

class HomePage extends HTMLElement {
    connectedCallback(): void {
        getSharedDarkLightMode();

        registerServiceWorker();
        registerOfflinePlugin();

        new GoogleAnalytics().trackPage();
        new GetSiteVersionNumber().init();
    }

    disconnectedCallback(): void {
        // Perform global cleanup if the main app component is ever disconnected
        // Only destroy singleton if no other consumer holds reference; header will recreate lazily
        if (darkLightModeInstance) {
            DarkLightMode.destroyInstance();
            darkLightModeInstance = null;
        }
    }
}

export default HomePage;
customElements.define("app-main", HomePage)