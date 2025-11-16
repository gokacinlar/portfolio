import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;
import { ModalList, AccordionList } from "../static";

class Accordion {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.connectedCallback();
        });
    }

    public render(): string {
        const accordionItemsHtml = AccordionList.ACCORDION_ITEMS.map((item, idx) => `
            <div class="accordion-item${idx > 0 ? " border border-0" : ""}">
                <h2 class="accordion-header" id="flush-heading${item.id}">
                    <button class="accordion-button fs-5 fw-medium collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${item.id}" aria-expanded="false" aria-controls="flush-collapse${item.id}">
                        ${item.header}
                    </button>
                </h2>
                <div id="flush-collapse${item.id}" class="accordion-collapse collapse" aria-labelledby="flush-heading${item.id}" data-bs-parent="#aboutAccordion">
                    <div class="accordion-body">
                        ${item.body}
                    </div>
                </div>
            </div>
        `).join("");

        const modalsHtml = ModalList.MODALS.map(modal => `
            <div id="${modal.id}" class="modal" tabindex="-1">
                <div class="modal-dialog modal-dialog-centered ">
                    <div class="modal-content rounded-4 shadow-lg">
                        <div class="modal-header px-4 py-3">
                            <h5 class="modal-title">${modal.title}</h5>
                            <button type="button" class="btn-close border border-1 border-secondary-subtle rounded-pill" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body rounded-5">
                            ${modal.content}
                        </div>
                    </div>
                </div>
            </div>
        `).join("");

        return `
            <div class="accordion accordion-flush" id="aboutAccordion">
                ${accordionItemsHtml}
            </div>
            ${modalsHtml}
        `;
    }

    connectedCallback(): void {
        // Event delegation for modal triggers
        document.body.addEventListener("click", (event) => {
            const target = event.target as HTMLElement;
            if (target.classList.contains("modal-trigger") && target.dataset.modal) {
                event.preventDefault();
                const modalElement = document.getElementById(target.dataset.modal);
                if (modalElement) {
                    const modalInstance = new bootstrap.Modal(modalElement);
                    modalInstance.show();
                }
            }
        });
    }
}

export default Accordion;