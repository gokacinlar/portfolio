import Localize from "../../utils/initLocalization";

class BlogUi {
    public static initiateOffCanvas() {
        return /*html*/ `
            <div id="offCanvasControls" class="d-flex flex-row align-items-center justify-content-end gap-2" role="group" aria-label="${Localize.translate("common:offcanvas:btnMessage")}">
                ${this.downloadRssButton()}
                <button class="btn btn-sm btn-warning rounded-pill shadow-sm" type="button" id="displayOffCanvasBtn" data-bs-toggle="offcanvas" data-bs-target="#blogAsideOffcanvasTemplate"
                    aria-controls="blogAsideOffcanvasTemplate" title="${Localize.translate("common:offcanvas:btnMessage")}">
                    <i class="offcanvas-menu-icon bi bi-list display-6 fw-bold"></i>
                </button>
            </div>
        `;
    }

    public static blogAside(): string {
        return /*html*/ `
            <aside id="blogAside" class="h-100 rounded-5 px-3 py-3 shadow-sm">
                <section id="rssInfo">
                    ${this.downloadRssButton()}
                </section>
                <section id="blogAsideChild" class="mt-3 rounded-5 px-3 py-3 border border-1 border-dark-subtle"></section>
            </aside>
        `;
    }

    public static downloadRssButton(): string {
        return /*html*/ `
            <button id="downloadRssBtn" type="button" class="download-rss-button bee-color-btn bg-gradient btn btn-lg rounded-5 fs-4 shadow-sm d-flex flex-row align-items-center justify-content-center gap-1 modal-trigger"
                role="button" title="${Localize.translate("common:modals:rss:btnTitle")}" data-modal="rssModal">
                <i class="bi bi-rss-fill fw-bold"></i>
            </button>
        `;
    }

    public static offCanvas(): string {
        return /*html*/ `
            <div class="offcanvas offcanvas-start rounded-end-4" tabindex="-1" id="blogAsideOffcanvasTemplate" aria-labelledby="blogAsideOffcanvas" data-bs-scroll="true" data-bs-backdrop="true">
                <div class="offcanvas-header bg-secondary-subtle rounded-end-4">
                    <h5 class="offcanvas-title" id="blogAsideOffcanvas">${Localize.translate("common:blog:latestUpdates")}</h5>
                    <button id="dismissOffcanvasBtn" type="button" class="btn btn-sm btn-close fs-5 fw-bold" data-bs-dismiss="offcanvas" aria-label="${Localize.translate("common:misc:close")}"></button>
                </div>
                <div id="offCanvasArea" class="offcanvas-body">

                </div>
            </div>
        `;
    }
}

export default BlogUi;