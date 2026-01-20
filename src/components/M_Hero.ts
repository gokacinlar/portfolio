import { HtmxControls } from "../components/M_htmx";
import Localize from "../utils/initLocalization";

export class HeaderHireButton extends HTMLElement {
    private _linkElement: HTMLAnchorElement | null = null;

    static get observedAttributes(): string[] {
        return ["href", "title", "icon", "btn-text-key", "htmx-options"];
    }

    connectedCallback(): void {
        this.render();
    }

    disconnectedCallback(): void {
        if (this._linkElement) {
            this.removeChild(this._linkElement);
            this._linkElement = null;
        }
    }

    attributeChangedCallback(_name: string, oldValue: string | null, newValue: string | null): void {
        if (oldValue !== newValue && this.isConnected) {
            this.render();
        }
    }

    private render(): void {
        if (this._linkElement) {
            this.removeChild(this._linkElement);
        }

        const href = this.getAttribute("href") || "/work.html";
        const title = this.getAttribute("title") || Localize.translate("common:hero:buttonTitles:workHire");
        const icon = this.getAttribute("icon") || "bi bi-star-half text-black fw-bold pulsate-fwd";
        const btnTextKey = this.getAttribute("btn-text-key") || "common:hero:buttons:workWMe";
        const htmxOptionsJson = this.getAttribute("htmx-options");
        let htmxOptions: any = {};

        if (htmxOptionsJson) {
            try {
                htmxOptions = JSON.parse(htmxOptionsJson);
            } catch (e) {
                console.warn("Invalid htmx-options JSON");
            }
        }

        this._linkElement = document.createElement("a");
        this._linkElement.id = "hrBtn";
        this._linkElement.href = href;
        this._linkElement.title = title;
        this._linkElement.className = "header-btn-bg-important bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-2";
        this._linkElement.innerHTML = `
            <i class="${icon}"></i>
            <span class="hr-btn-text">${Localize.translate(btnTextKey)}</span>
        `;
        if (Object.keys(htmxOptions).length > 0) {
            this._linkElement.innerHTML += new HtmxControls(htmxOptions).render();
        }

        this.appendChild(this._linkElement);
    }
}

customElements.define("component-header-hire-btn", HeaderHireButton);