import * as bootstrap from "bootstrap";
window.bootstrap = bootstrap;

interface AccordionItem {
    id: string;
    header: string;
    body: string;
    modalTriggerId?: string;
    modalId?: string;
}

interface ModalConfig {
    id: string;
    title: string;
    content: string;
}

// Define constants to be manip by map function in class
const MODALS: ModalConfig[] = [
    {
        id: "gnuPgModal",
        title: "🧲 GnuPG Public Key",
        content: `
            <div class="mt-2 fs-6 fw-medium bg-dark-subtle px-2 py-2">
                <p>
                    <code>
                        -----BEGIN PGP PUBLIC KEY BLOCK-----<br>
                        mDMEaIQ5/BYJKwYBBAHaRw8BAQdAkPugW/CL7j8YUNjNMfOu+Vzdbzqcy+ej7bgS<br>
                        sA1YzA20K0RlcnZpxZ8gw5Zrc8O8em/En2x1IDxnb2thY2lubGFyQHlhYW5pLmNv<br>
                        bT6ImQQTFgoAQRYhBJ/je/y0W1eL4i6+FUY7feypcQnrBQJohDn8AhsDBQkFpUsU<br>
                        BQsJCAcCAiICBhUKCQgLAgQWAgMBAh4HAheAAAoJEEY7feypcQnrbUYBAMd5oK3D<br>
                        qi3Dd8WlaDyYU0gvWzeRYkz5LY60vJg7hnqGAP4yl1zQR4QSUF/Wb3nu1rhf2DY2<br>
                        UfFDatM+C+dwx+CWDrg4BGiEOfwSCisGAQQBl1UBBQEBB0AqEb35sWJz4KgjMGQf<br>
                        G/69rSzKDXQzc6Pd+OEXY4gtSwMBCAeIfgQYFgoAJhYhBJ/je/y0W1eL4i6+FUY7<br>
                        feypcQnrBQJohDn8AhsMBQkFpUsUAAoJEEY7feypcQnrKooBANZf9FjNAEDupyXy<br>
                        LvovedoNsJBqhWI2xoKJhAL8cJBxAQDNapwGCkPhCyhYSeN2GscmlXNh8BxAFR90<br>
                        OV5PvJpMAQ==<br>
                        =BuXQ<br>
                        -----END PGP PUBLIC KEY BLOCK-----
                    </code>
                </p>
            </div>
        `
    }
];

const ACCORDION_ITEMS: AccordionItem[] = [
    {
        id: "One",
        header: "🔑 Secure & Private Communication",
        body: `
            <p class="lead fs-6 fw-medium">If you want to contact me <mark class="rounded-3">in a more private way</mark>, you can use one of the actions given below.
                If you don't know how to use these methods, here's a <a class="link-info link-opacity-75-hover link-offset-2" href="https://www.youtube.com/watch?v=mu2TVYJE5Gc" target="_blank">tutorial</a> on the go.
                However, you should use this <strong>if you really have good reason to do so.</strong>
            </p>
            <table id="commsTable" class="table table-striped table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">Jami (Client)</th>
                        <td><code>gokacinlar</code></td>
                    </tr>
                    <tr>
                        <th scope="row">GnuPG (Public Key)</th>
                        <td>View <a class="link-info link-opacity-75-hover link-offset-2 modal-trigger" data-modal="gnuPgModal" href="#">here.</a></td>
                    </tr>
                </tbody>
            </table>
        `,
        modalTriggerId: "gnupgKey",
        modalId: "gnuPgModal"
    },
    {
        id: "Two",
        header: "💞 Donations",
        body: `
            <p class="lead fs-6 fw-medium">If you're <em>somehow</em> interested in my work, you can support me via the options given below:</p>
            <table id="commsTable" class="table table-striped table-bordered">
                <tbody>
                    <tr>
                        <th scope="row">BuyMeACoffee</th>
                        <td>View <a class="link-info link-opacity-75-hover link-offset-2" href="https://coff.ee/gokacinlar" target="_blank">here.</a></td>
                    </tr>
                </tbody>
            </table>
        `
    }
];

class Accordion {
    constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            this.connectedCallback();
        });
    }

    public render(): string {
        const accordionItemsHtml = ACCORDION_ITEMS.map((item, idx) => `
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

        const modalsHtml = MODALS.map(modal => `
            <div id="${modal.id}" class="modal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${modal.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
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