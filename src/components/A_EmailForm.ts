export function renderEmailTable(): string {
    return `
        <table class="table table-bordered align-middle table-responsive">
            <tbody>
                <tr>
                    <th scope="row">
                        <label for="firstName" class="form-label">Your Name</label>
                    </th>
                    <td>
                        <input type="text" class="form-control" id="firstName" name="First Name" placeholder="John Doe" required autocomplete="name">
                        <div class="invalid-feedback">
                            Please provide your name.
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row">
                        <label for="email" class="form-label">Email</label>
                    </th>
                    <td>
                        <input type="email" class="email-validate form-control" id="email" name="email" placeholder="someone@example.com" autocomplete="off" required>
                        <div class="invalid-feedback">
                            Please provide your e-mail address.
                        </div>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="message" class="form-label">Message</label></th>
                    <td>
                        <textarea class="form-control" id="message" name="message" rows="4" placeholder="Type your message here..." required></textarea>
                        <div class="invalid-feedback">
                            Please enter a message in the textarea.
                        </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2">
                        <div class="d-flex flex-row align-items-center justify-content-end">
                            <button id="aboutFormSubmitBtn" type="submit" class="bee-color-btn bg-gradient btn btn-lg rounded-5 fs-5 shadow-sm" title="Submit Form">Send Message</button>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    `;
}

export function renderEmailForm(): string {
    return `
        <form id="emailForm" class="was-validated" action="https://api.web3forms.com/submit" method="POST">
            <input type="hidden" name="access_key" value="${process.env.WEB3_FORM_ACCESS_KEY}">
            <input type="hidden" name="subject" value="New Message">
            <input type="hidden" name="from_name" value="https://dervisoksuzoglu.com.tr">
            <input type="checkbox" name="botcheck" class="d-none">
            ${renderEmailTable()}
        </form>
    `;
}