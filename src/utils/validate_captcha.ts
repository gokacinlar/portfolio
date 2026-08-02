import { insertToastifiedMessage } from "./helper";
import Localize from "./initLocalization";

class ValidateCaptcha {
    private lastClickTime = 0;
    private static readonly CLICK_COOLDOWN_MS = 5000;

    public validate(element: string): void {
        try {
            const targetElement = document.getElementById(element) as HTMLButtonElement;

            if (!targetElement) {
                console.error(`Element with name of ${targetElement} not found...`);
                return;
            } else {
                targetElement.addEventListener("click", async () => {
                    if (Date.now() - this.lastClickTime < ValidateCaptcha.CLICK_COOLDOWN_MS) {
                        insertToastifiedMessage(Localize.translate("common:toasts:rateLimit"));
                        return;
                    }

                    // Verify reCAPTCHA response
                    const recaptchaResponse = grecaptcha.getResponse();
                    if (!recaptchaResponse) {
                        insertToastifiedMessage(Localize.translate("common:toasts:completeCaptcha"));
                        return;
                    }

                    this.lastClickTime = Date.now();

                    try {
                        const response = await fetch("../php/RecaptchaVerify.php", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/x-www-form-urlencoded",
                            },
                            body: new URLSearchParams({
                                "captcha_submit": "true",
                                "g-recaptcha-response": recaptchaResponse
                            }),
                            credentials: "include"
                        });

                        const result = await response.json().catch(() => null);

                        if (!response.ok) {
                            insertToastifiedMessage(result?.message || Localize.translate("common:toasts:requestFailed", { status: response.status }));
                            return;
                        }

                        if (result?.success) {
                            insertToastifiedMessage(Localize.translate("common:toasts:verified"));
                            console.log("CAPTCHA Success! Beginning download.");
                            this.handleDownload(); // Download process begins
                        } else {
                            console.error(`Too many requests ${result?.error ?? ""}`);
                            insertToastifiedMessage(result?.message || Localize.translate("common:toasts:verificationFailed"));
                            grecaptcha.reset();
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

    private async handleDownload(): Promise<void> {
        try {
            const response = await fetch(
                "../php/DownloadCv.php",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/pdf",
                    },
                    credentials: "include"
                }
            );

            if (!response.ok) {
                insertToastifiedMessage(response.status === 429
                    ? Localize.translate("common:toasts:rateLimitLater")
                    : Localize.translate("common:toasts:downloadFailed"));
                return;
            }

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "DOO-CV-REDACTED.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error: unknown) {
            console.error("Unable to download file:", error);
            insertToastifiedMessage(Localize.translate("common:toasts:downloadFailed"));
        }
    }
}

export default ValidateCaptcha;
