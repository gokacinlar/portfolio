export default class ValidateCaptcha {
    private targetElement: string

    constructor(element: string) {
        this.targetElement = element;
        this.validate(element);
    }

    private validate(_element: string): void {
        try {
            const form = document.querySelector("form") as HTMLFormElement;

            if (!form) {
                console.error("Form not found");
                return;
            }

            form.addEventListener("submit", async (event: Event) => {
                event.preventDefault(); // Prevent form submission

                // Verify reCAPTCHA response
                const recaptchaResponse = grecaptcha.getResponse();

                if (!recaptchaResponse) {
                    console.error("Please complete the reCAPTCHA");
                    return;
                }

                try {
                    const response = await fetch("../php/captcha_verify.php", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        mode: "cors",
                        body: new URLSearchParams({
                            "captcha_submit": "true",
                            "g-recaptcha-response": recaptchaResponse
                        })
                    });

                    const result = await response.json();
                    if (result.success) {
                        console.log("CAPTCHA SUCCESS!");
                    } else {
                        grecaptcha.reset();
                        console.error("CAPTCHA verification failed");
                    }
                } catch (error: unknown) {
                    console.error("Verification error:", error);
                    grecaptcha.reset();
                }
            });
        } catch (error: unknown) {
            console.error("Validation setup error:", error);
        }
    }
}