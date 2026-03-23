import Localize from "../utils/initLocalization";
import { Template } from "../utils/helper";

export class MaintenanceStatus extends HTMLElement {
    private static MESSAGE: string;

    constructor() {
        super();
        MaintenanceStatus.MESSAGE = Localize.translate("common:maintenance:status");
        new Template().createTemplate(MaintenanceStatus.render(), this);
    }

    connectedCallback(): void {
        if (this.hasAttribute("maintenance")) {
            this.innerHTML = "";
            new Template().createTemplate(MaintenanceStatus.render(), this);
        }
    }

    private static render(): string {
        return /*html*/ `
            <div class="alert alert-warning d-block w-100 px-3 py-3 text-center fs-5 border-0 border-bottom rounded-0" role="alert">
                <div class="d-flex flex-row align-items-center justify-content-center gap-2">
                    <i class="bi bi-exclamation-diamond"></i>
                    <span>
                        ${MaintenanceStatus.MESSAGE}
                    </span>
                </div>
            </div>
        `;
    }

    attributeChangedCallback(name: string): void {
        if (name === "maintenance") {
            this.innerHTML = "";
            new Template().createTemplate(MaintenanceStatus.render(), this);
        }
    }

    static get observedAttributes(): Array<string> {
        return ["maintenance"];
    }
}

customElements.define("app-maintenance-status", MaintenanceStatus);