class EmailForm {
    render(): string {
        return `
            <form id="emailForm" class="was-validated" action="https://api.web3forms.com/submit" method="POST">
                <div>
                    <input type="hidden" name="access_key" value="062eaab4-5d36-49de-b350-a37ea9a751d1">
                    <input type="hidden" name="subject" value="New Message">
                    <input type="hidden" name="from_name" value="https://dervisoksuzoglu.com.tr">
                    <input type="checkbox" name="botcheck" class="d-none">
                </div>
                <table class="table table-bordered align-middle table-responsive">
                    <tbody>
                        <tr>
                            <th scope="row">
                                <label for="firstName" class="form-label">Your Name</label>
                            </th>
                            <td>
                                <input type="text" class="form-control" id="firstName" name="First Name" placeholder="example: 'John'" required>
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
                                <input type="email" class="email-validate form-control" id="email" name="Email" placeholder="someone@example.com" required>
                                <div class="invalid-feedback">
                                    Please provide your e-mail address.
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th scope="row"><label for="message" class="form-label">Message</label></th>
                            <td>
                                <textarea class="form-control is-invalid" id="message" name="message" rows="4" placeholder="Type your message here..." required></textarea>
                                <div class="invalid-feedback">
                                    Please enter a message in the textarea.
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="d-flex flex-row align-items-center justify-content-between">
                    <div class="my-3">
                        <div class="h-captcha" data-captcha="true"></div>
                    </div>
                    <button id="aboutFormSubmitBtn" type="submit" class="bg-gradient btn btn-lg rounded-5 fs-5 shadow-sm" title="Submit Form">Send Message</button>
                </div>
            </form>
        `;
    }
}

export default EmailForm;