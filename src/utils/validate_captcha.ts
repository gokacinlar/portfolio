import { insertToastifiedMessage } from "./helper";

class ValidateCaptcha {
    constructor() { }

    public validate(element: string): void {
        try {
            const targetElement = document.getElementById(element) as HTMLButtonElement;

            if (!targetElement) {
                console.error(`Element with name of ${targetElement} not found...`);
                return;
            } else {
                targetElement.addEventListener("click", async () => {
                    // Verify reCAPTCHA response
                    const recaptchaResponse = grecaptcha.getResponse();
                    if (!recaptchaResponse) {
                        insertToastifiedMessage("Please complete the captcha request.");
                        return;
                    }

                    try {
                        const response = await fetch("../php/RecaptchaVerify.php", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                "captcha_submit": "true",
                                "g-recaptcha-response": recaptchaResponse
                            })
                        });

                        if (!response.ok) {
                            console.error(`HTTP Error: ${response.status}`);
                            return;
                        }

                        const result = await response.json();
                        if (result.success) {
                            insertToastifiedMessage("CAPTCHA has been verified. Beginning download.")
                            console.log("CAPTCHA Success! Beginning download.");
                        } else {
                            console.error("CAPTCHA verification failed" + result.error);
                            insertToastifiedMessage("CAPTCHA verification failed. See console for more info (F12).");
                        }
                    } catch (error: unknown) {
                        console.error("Verification error:", error);
                        grecaptcha.reset();
                    }
                });
            }
        } catch (error: unknown) {
            console.error("Validation setup error:", error);
        }
    }
}

export default ValidateCaptcha;