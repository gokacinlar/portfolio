import {
    Template
} from "../utils/helper";
import Localize from "../utils/initLocalization";

class WorkPage extends HTMLElement {
    constructor() {
        super();
        new Template().createTemplate(this.render(), this);
    }

    private render(): string {
        return /*html*/ `
<section id="mainWork">
    <div class="container text-center h-100">
        <div class="row gy-2 gx-2 align-items-center h-100">
            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-8">
                <h1 class="display-1 text-start fw-medium pe-none"><mark class="px-4 py-1 rounded-end-5">${Localize.translate("common:workPage:hireMe")}</mark> ${Localize.translate("common:workPage:orSeePlans")}</h1>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-6 colg-lg-4">
                <a type="button" href="#buyOptions" id="workScrollDownBtn" class="btn btn-lg rounded-5 shadow-sm fw-medium fs-2 mx-auto d-flex flex-row align-items-center justify-content-center gap-2" title="${Localize.translate("common:workPage:scrollDown")}" type="button">
                    <span class="work-scroll-down-indicator">${Localize.translate("common:workPage:seePlans")}</span>
                    <i class="work-scroll-down-icon bi bi-arrow-down-circle-fill fs-1"></i>
                </a>
            </div>
        </div>
    </div>
</section>
<article id="buyOptions" class="px-2 py-2 mx-2 my-2 rounded-5 h-100 shadow-sm">
    <component-options></component-options>
</article>
`;
    }

    public static navigate(): string {
        return /*html*/ `
<ul class="nav nav-pills nav-fill px-0 gap-3" role="tablist">
    <li class="nav-item" role="presentation">
        <button class="nav-link active rounded-5 fs-2 fw-medium shadow-sm" aria-current="page" data-bs-toggle="tab" data-bs-target="#englishOptions" type="button" role="tab" aria-controls="englishOptions" aria-selected="true" id="forEnglish">${Localize.translate("common:workPage:forEnglish")}</button>
    </li>
    <li class="nav-item" role="presentation">
        <button class="nav-link rounded-5 fs-2 fw-medium shadow-sm" data-bs-toggle="tab" data-bs-target="#programmingOptions" type="button" role="tab" aria-controls="programmingOptions" aria-selected="false" id="forProgramming">${Localize.translate("common:workPage:forProgramming")}</button>
    </li>
</ul>
`;
    }

    public static content(): string {
        return /*html*/ `
<div id="optionsContent" class="bg-secondary-subtle px-3 py-3 rounded-5 shadow-sm">
    <div class="tab-pane fade show active" id="englishOptions" role="tabpanel" aria-labelledby="forEnglish">${Localize.translate("common:workPage:comingSoon")}</div>
    <div class="tab-pane fade" id="programmingOptions" role="tabpanel" aria-labelledby="forProgramming">${Localize.translate("common:workPage:comingSoon")}</div>
</div>
`;
    }
}


class Options extends HTMLElement {
    constructor() {
        super();
        new Template().createTemplate(Options.renderOptions(), this);
    }

    public static renderOptions(): string {
        return /*html*/ `
<section class="py-2 px-2">
    <div class="container-fluid gy-2 h-100">
        <div class="row">
            ${WorkPage.navigate()}
        </div>
        <div class="row mt-3">
            ${WorkPage.content()}
        </div>
    </div>
</section>
`;
    }
}

customElements.define("component-options", Options);
customElements.define("app-work", WorkPage);
export default WorkPage;