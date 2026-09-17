import Localize from "../utils/initLocalization";
import type * as iFace from "../ts/interfaces/i.global";

export class WorkButton {
    public render(button: iFace.WorkButtonConfig, parent: Pick<iFace.EnglishWorkBuyingOptions, "courseName" | "courseLabel">, isSecondary = false): string {
        const actionType = button.actionType ?? "contact";
        const label = button.label;
        const icon = button.icon ?? "";

        let btnClass = "btn-primary work-card-btn--contact";
        let defaultIcon = "bi-send-fill";
        let target = "_self";
        let rel = "";

        if (actionType === "udemy") {
            btnClass = "btn-warning text-dark border-warning work-card-btn--udemy disabled";
            defaultIcon = "bi-bag-fill";
            target = "_blank";
            rel = "noopener noreferrer";
        } else if (actionType === "enroll") {
            btnClass = "btn-success work-card-btn--enroll";
            defaultIcon = "bi-people-fill";
        } else if (actionType === "github") {
            btnClass = "btn-dark work-card-btn--github";
            defaultIcon = "bi-github";
            target = "_blank";
            rel = "noopener noreferrer";
        } else if (actionType === "whatsapp") {
            btnClass = "btn-success work-card-btn--whatsapp";
            defaultIcon = "bi-whatsapp";
            target = "_blank";
            rel = "noopener noreferrer";
        } else if (actionType === "external") {
            btnClass = "btn-outline-primary work-card-btn--external";
            defaultIcon = "bi-box-arrow-up-right";
            target = "_blank";
            rel = "noopener noreferrer";
        }

        const finalIcon = icon || defaultIcon;
        const variantClass = isSecondary && actionType === "whatsapp" ? "btn-outline-success work-card-btn--whatsapp-outline" : btnClass;

        return /*html*/ `
            <a href="${button.url}"
               class="btn btn-lg w-100 rounded-pill fw-medium d-inline-flex align-items-center justify-content-center gap-2 work-card-btn ${isSecondary ? variantClass : btnClass}"
               data-action-type="${actionType}"
               data-course-label="${parent.courseLabel}"
               data-course-name="${parent.courseName}"
               ${isSecondary ? `data-button-role="secondary"` : `data-button-role="primary"`}
               target="_blank"
               title="${label} - ${parent.courseName}"
               aria-label="${label} for ${parent.courseName}">
                ${finalIcon ? `<i class="bi ${finalIcon}" aria-hidden="true"></i>` : ""}
                <span>${label}</span>
                <i class="bi bi-box-arrow-up-right small" aria-hidden="true"></i>
            </a>
        `;
    }
}

export class WorkCard {
    private buttonRenderer = new WorkButton();

    public render(data: iFace.EnglishWorkBuyingOptions): string {
        const baseKey = `common:workPage:cards:${this.detectCategory(data)}:${data.courseLabel}`;
        const name = this.t(`${baseKey}:name`, data.courseName);
        const description = this.t(`${baseKey}:description`, data.courseDescription);
        const buttonLabel = this.t(`${baseKey}:buttonLabel`, data.courseButtonLabel ?? "Go somewhere");
        const buttonIcon = this.t(`${baseKey}:buttonIcon`, data.courseButtonIcon ?? "");

        const localized: iFace.EnglishWorkBuyingOptions = {
            ...data,
            courseName: name,
            courseDescription: description,
            courseButtonLabel: buttonLabel,
            courseButtonIcon: buttonIcon,
            courseExtraButtons: (data.courseExtraButtons ?? []).map((btn, idx) => {
                const extraLabel = this.t(`${baseKey}:whatsappLabel`, this.t(`${baseKey}:extraButton:${idx}:label`, btn.label));
                const extraIcon = this.t(`${baseKey}:extraButton:${idx}:icon`, btn.icon ?? "");
                return {
                    ...btn,
                    label: extraLabel,
                    ...(extraIcon ? { icon: extraIcon } : btn.icon ? { icon: btn.icon } : {}),
                } as iFace.WorkButtonConfig;
            }),
        };

        const hasImage = Boolean(localized.coursePromoImageUrl);
        const imgHtml = hasImage
            ? /*html*/ `<img class="card-img-top work-card-img object-fit-cover pe-none" 
            src="${localized.coursePromoImageUrl}" alt="${localized.courseName}" loading="lazy" decoding="async">`
            : /*html*/ `<div class="card-img-top work-card-img work-card-img--placeholder d-flex align-items-center justify-content-center bg-body-secondary text-secondary">
                <i class="bi bi-image fs-1" aria-hidden="true"></i>
                <span class="visually-hidden">${localized.courseName}</span>
            </div>`;

        const isSingleBuy = localized.courseActionType === "udemy";
        const priceLabel = isSingleBuy ? `₺${localized.coursePrice}` : `₺${localized.coursePrice}/saat`;

        return /*html*/ `
            <div class="col d-flex">
                <div class="card work-card h-100 w-100 d-flex flex-column rounded-5 shadow-sm overflow-hidden">
                    ${imgHtml}
                    <div class="card-body d-flex flex-column flex-grow-1 p-3 p-md-3">
                        <h5 class="card-title fw-semibold fs-4 mb-2">${localized.courseName}</h5>
                        <p class="card-text flex-grow-1 mb-3 text-body-secondary">${localized.courseDescription}</p>
                        <div class="d-flex align-items-center justify-content-between gap-2 mt-auto">
                            <span class="badge rounded-pill text-bg-warning fs-6 fw-bold px-3 py-2">${priceLabel}</span>
                        </div>
                    </div>
                    <div class="card-footer bg-transparent border-0 p-2 p-md-3 pt-0 mt-auto">
                        ${this.renderActions(localized)}
                    </div>
                </div>
            </div>
        `;
    }

    private renderActions(data: iFace.EnglishWorkBuyingOptions): string {
        const primary: iFace.WorkButtonConfig = {
            label: data.courseButtonLabel ?? "Go to link",
            url: data.courseUrl,
            actionType: data.courseActionType ?? "Contact",
            icon: data.courseButtonIcon ?? "",
        };

        const extra = data.courseExtraButtons ?? [];
        const all = [primary, ...extra];

        if (all.length === 1) {
            return this.buttonRenderer.render(primary, data, false);
        }

        return /*html*/ `
            <div class="work-card-actions d-flex flex-column gap-2 w-100">
                ${all.map((btn, idx) => this.buttonRenderer.render(btn, data, idx > 0)).join("")}
            </div>
        `;
    }

    private detectCategory(data: iFace.EnglishWorkBuyingOptions): string {
        const programmingLabels = ["frontend", "backend", "fullstack", "review"];
        return programmingLabels.includes(data.courseLabel) ? "programming" : "english";
    }

    private t(key: string, fallback: string): string {
        const translated = Localize.translate(key);
        if (!translated || translated === key) return fallback;
        return translated;
    }
}

export class WorkFeaturedCard {
    private buttonRenderer = new WorkButton();

    public render(plan: iFace.FeaturedPlanConfig): string {
        const isHighlighted = Boolean(plan.highlighted);
        const tierClass = isHighlighted ? "featured-plan--highlighted border-warning shadow" : `border ${plan.accent ?? "border-secondary-subtle"} shadow-sm`;
        const headerBg = isHighlighted ? "bg-warning bg-opacity-10" : "bg-body";
        const tierKey = `common:workPage:featured:plans:${plan.tier}`;

        const tierLabel = this.t(`${tierKey}:label`, plan.tierLabel);
        const subtitle = this.t(`${tierKey}:subtitle`, plan.subtitle);
        const badge = this.t(`${tierKey}:badge`, plan.badge ?? "");
        const isSingleBuy = plan.button?.actionType === "udemy";
        const rawPricePeriod = this.t(`${tierKey}:pricePeriod`, plan.pricePeriod ?? "/hour");
        const pricePeriod = isSingleBuy ? "" : rawPricePeriod;
        const features = this.tArray(`${tierKey}:features`, plan.features);
        const excludedFeatures = this.tArray(`${tierKey}:excludedFeatures`, plan.excludedFeatures ?? []);

        const featureList = features
            .map((f) => /*html*/ `<li class="d-flex align-items-start gap-2 mb-2">
                <i class="bi bi-check-circle-fill text-success mt-1 flex-shrink-0" aria-hidden="true"></i>
                <span>${f}</span>
            </li>`)
            .join("");

        const excludedList = excludedFeatures
            .map((f) => /*html*/ `<li class="d-flex align-items-start gap-2 mb-2 text-body-secondary opacity-75">
                <i class="bi bi-x-circle mt-1 flex-shrink-0" aria-hidden="true"></i>
                <span>${f}</span>
            </li>`)
            .join("");

        const primaryLabel = this.t(`${tierKey}:buttonLabel`, plan.button.label);
        const primaryIcon = this.t(`${tierKey}:buttonIcon`, plan.button.icon ?? "");
        const localizedPrimary = {
            ...plan.button,
            label: primaryLabel,
            ...(primaryIcon ? { icon: primaryIcon } : plan.button.icon ? { icon: plan.button.icon } : {}),
        } as iFace.WorkButtonConfig;

        const primaryBtn = this.buttonRenderer.render(localizedPrimary, { courseName: tierLabel, courseLabel: plan.tier }, false);
        const secondaryBtn = plan.secondaryButton
            ? (() => {
                const secLabel = this.t(`${tierKey}:secondaryButtonLabel`, plan.secondaryButton!.label);
                const secIcon = this.t(`${tierKey}:secondaryButtonIcon`, plan.secondaryButton!.icon ?? "");
                const localizedSec = {
                    ...plan.secondaryButton!,
                    label: secLabel,
                    ...(secIcon ? { icon: secIcon } : plan.secondaryButton!.icon ? { icon: plan.secondaryButton!.icon } : {}),
                } as iFace.WorkButtonConfig;
                return this.buttonRenderer.render(localizedSec, { courseName: tierLabel, courseLabel: plan.tier }, true);
            })()
            : "";

        const cta = secondaryBtn
            ? /*html*/ `<div class="work-card-actions d-flex flex-column gap-2 w-100">${primaryBtn}${secondaryBtn}</div>`
            : primaryBtn;

        return /*html*/ `
            <div class="col d-flex">
                <div class="card featured-plan h-100 w-100 d-flex flex-column rounded-4 ${tierClass} overflow-hidden ${isHighlighted ? "featured-plan--pro" : ""}">
                    <div class="card-header ${headerBg} border-0 px-3 px-md-4 py-3 py-md-4 text-center">
                        ${badge ? `<span class="badge rounded-pill text-bg-warning fw-bold px-3 py-2 mb-2">${badge}</span>` : ""}
                        <h3 class="h2 fw-bold mb-1">${tierLabel}</h3>
                        <p class="text-body-secondary small mb-3">${subtitle}</p>
                        <div class="d-flex align-items-baseline justify-content-center gap-1">
                            <span class="display-5 fw-bold">₺${plan.price}</span>
                            ${pricePeriod ? `<span class="text-body-secondary">${pricePeriod}</span>` : ""}
                        </div>
                    </div>
                    <div class="card-body d-flex flex-column flex-grow-1 px-3 px-md-4 py-3">
                        <ul class="list-unstyled mb-0 flex-grow-1">
                            ${featureList}
                            ${excludedList}
                        </ul>
                    </div>
                    <div class="card-footer bg-transparent border-0 px-3 px-md-4 pb-3 pb-md-4 pt-0 mt-auto">
                        ${cta}
                    </div>
                </div>
            </div>
        `;
    }

    private t(key: string, fallback: string): string {
        const translated = Localize.translate(key);
        if (!translated || translated === key) return fallback;
        return translated;
    }

    private tArray(key: string, fallback: string[]): string[] {
        const result = Localize.translate(key, { returnObjects: true } as any) as unknown;
        if (Array.isArray(result)) return result as string[];
        return fallback;
    }
}

export class WorkFeaturedSection {
    private cardRenderer = new WorkFeaturedCard();

    public render(plans: iFace.FeaturedPlanConfig[]): string {
        const title = Localize.translate("common:workPage:featured:title") !== "common:workPage:featured:title"
            ? Localize.translate("common:workPage:featured:title")
            : "Most Popular Plans";
        const subtitle = Localize.translate("common:workPage:featured:subtitle") !== "common:workPage:featured:subtitle"
            ? Localize.translate("common:workPage:featured:subtitle")
            : "Pick the plan that fits your goal & upgrade anytime.";

        return /*html*/ `
            <section id="featuredPlans" class="container-fluid px-2 px-md-3 py-4 my-2 my-md-3">
                <div class="text-center mb-3 mb-md-4 px-3 py-4 featured-title-card rounded-5 shadow-sm">
                    <h2 class="display-5 fw-bold pe-none mb-2"><i class="bi bi-rocket-takeoff"></i> ${title}</h2>
                    <p class="lead text-body-secondary mb-0">${subtitle}</p>
                </div>
                <div class="row g-3 g-md-4 row-cols-1 row-cols-md-3 align-items-stretch justify-content-center">
                    ${plans.map((plan) => this.cardRenderer.render(plan)).join("")}
                </div>
            </section>
        `;
    }
}
