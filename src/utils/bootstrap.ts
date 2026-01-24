import { ModalConfig } from "../static";

let delegatedModalClickListener: ((event: Event) => void) | null = null;

export function renderModal(modalSource: ModalConfig[]) {
    const modalsHtml = modalSource.map(modal => `
        <div id="${modal.id}" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
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
        ${modalsHtml}
    `;
}

// This function now ensures the listener is added only once and returns a cleanup function.
export function listenForBootstrapModalEventDelegation(): () => void {
    if (delegatedModalClickListener) {
        return () => { };
    }

    delegatedModalClickListener = (event: Event) => {
        const target = event.target as HTMLElement;
        const modalTrigger = target.closest(".modal-trigger") as HTMLElement;

        if (modalTrigger && modalTrigger.dataset.modal) {
            event.preventDefault();
            const modalElement = document.getElementById(modalTrigger.dataset.modal);

            if (modalElement) {
                const modalInstance = new (window.bootstrap.Modal)(modalElement);
                modalInstance.show();

                modalElement.addEventListener("hidden.bs.modal", () => {
                    modalInstance.dispose();
                }, { once: true });
            }
        }
    };

    document.body.addEventListener("click", delegatedModalClickListener);

    // Return a cleanup function
    return () => {
        if (delegatedModalClickListener) {
            document.body.removeEventListener("click", delegatedModalClickListener);
            delegatedModalClickListener = null;
        }
    };
}