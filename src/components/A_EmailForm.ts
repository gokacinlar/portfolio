import Localize from "../utils/initLocalization";

export function renderEmailTable(): string {
    return /*html*/ `
        <table class="table table-bordered align-middle table-responsive form-floating">
            <tbody>
                <tr class="col-auto">
                    <th scope="row">
                        <label for="firstName" class="form-label">${Localize.translate("common:emailForm:yourName")}</label>
                    </th>
                    <td>
                        <input type="text" class="form-control is-invalid" id="firstName" name="First Name" placeholder="${Localize.translate("common:emailForm:someone")}" required autocomplete="name">
                        <div class="invalid-feedback">
                            ${Localize.translate("common:emailForm:provideName")}
                        </div>
                    </td>
                </tr>
                <tr class="col-auto">
                    <th scope="row">
                        <label for="email" class="form-label">${Localize.translate("common:emailForm:email")}</label>
                    </th>
                    <td>
                        <input type="email" class="email-validate form-control" id="email" name="email" placeholder="${Localize.translate("common:emailForm:emailPlaceholder")}" autocomplete="off" required>
                        <div class="invalid-feedback">
                            ${Localize.translate("common:emailForm:provideEmail")}
                        </div>
                    </td>
                </tr>
                <tr class="col-auto">
                    <th scope="row"><label for="message" class="form-label">${Localize.translate("common:emailForm:message")}</label></th>
                    <td>
                        <textarea class="form-control" id="message" name="message" rows="4" placeholder="${Localize.translate("common:emailForm:messagePlaceholder")}" required></textarea>
                        <div class="invalid-feedback">
                            ${Localize.translate("common:emailForm:provideMessage")}
                        </div>
                    </td>
                </tr>
                <tr class="col-auto">
                    <td colspan="2">
                        <div class="d-flex flex-row align-items-center justify-content-end">
                            <button id="aboutFormSubmitBtn" type="submit" class="bee-color-btn bg-gradient btn btn-lg rounded-5 fs-5 shadow-sm" title="${Localize.translate("common:emailForm:submitTitle")}">${Localize.translate("common:emailForm:sendMessage")}</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

export function renderEmailForm(): string {
    return /*html*/ `
        <form id="emailForm" class="was-validated" action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="access_key" value="${process.env.WEB3_FORM_ACCESS_KEY}">
            <input type="hidden" name="subject" value="${Localize.translate("common:emailForm:subject")}">
            <input type="hidden" name="from_name" value="https://dervisoksuzoglu.xyz">
            <input type="checkbox" name="botcheck" class="d-none">
            ${renderEmailTable()}
        </form>
    `;
}