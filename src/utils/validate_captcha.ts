export default class ValidateCaptcha {
    private targetElement: HTMLElement

    constructor(element: HTMLElement) {
        this.targetElement = element;
        this.validate(element);
    }

    private validate(element: HTMLElement): void {
        try {
            const targetElement = element;
            targetElement.addEventListener("submit", async (event: Event) => {
                event.preventDefault(); // Prevent form action by default
                const recaptchaResponse = grecaptcha.getResponse();

                try {
                    const response = await fetch("../php/captcha_verify.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                        },
                        mode: "cors",
                        body: new URLSearchParams({
                            "captcha_submit": "true",
                            "g-recaptcha-response": recaptchaResponse
                        })
                    });

                    const result = await response.json();
                    if (result.success) {
                        console.log("CAPTCHA SUCCESS!")
                    } else {
                        grecaptcha.reset();
                    }
                } catch (error) {
                    console.error("Verification error:", error);
                }
            })
        } catch (error: unknown) {

        }
    }

    private static handleSuccessfulVerification() {

    }

    private static handleFailedVerification() {

    }
}