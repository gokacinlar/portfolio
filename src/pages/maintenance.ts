import { Template } from "../helper";

export class MaintenanceStatus extends HTMLElement {
    private templating = new Template();
    constructor() {
        super();

        const template = this.templating.createTemplate(MaintenanceStatus.render());
        this.templating.appendTemplate(template, this);
    }

    connectedCallback(): void {
        if (this.hasAttribute("maintenance")) {
            MaintenanceStatus.render();
        }
    }

    private static readonly MESSAGE: string = "This site is currently in maintenance mode. Some functionality may not work.";
    // Use the attribute "maintenance" to display status on top of header
    private static render(): string {
        return `
            <div class="alert alert-warning d-block w-100 px-3 py-3 text-center fs-5" role="alert">
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
            MaintenanceStatus.render();
        }
    }

    // Special method to observe our element's attribute "maintenance"
    static get observedAttributes(): Array<string> {
        return ["maintenance"];
    }
}

customElements.define("app-maintenance-status", MaintenanceStatus);
