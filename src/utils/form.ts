import { insertToastifiedMessage } from "../utils/helper";

// Handle web3forms hCaptcha request
export function loadWeb3Forms(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.getElementById("web3forms-script")) {
            resolve();
            return;
        }

        const script = document.createElement("script") as HTMLScriptElement;
        script.id = "web3forms-script";
        script.src = "https://web3forms.com/client/script.js";
        script.async = true;
        script.defer = true;

        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            reject(new Error("Failed to load Web3Forms script"))
        };

        document.body.appendChild(script);
    });
}

// Function to manage form to display notifications
export function formState(): void {
    const form = document.getElementById("emailForm") as HTMLFormElement;

    if (!form) {
        console.error("Form element not found");
        return;
    }

    form.addEventListener("submit", async function (e: SubmitEvent) {
        e.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                insertToastifiedMessage("Your e-mail has been sent.");
                form.reset();
            } else {
                insertToastifiedMessage(data.message || "Unable to send your e-mail.");
            }
        } catch (error) {
            console.error("Form submission error:", error);
            insertToastifiedMessage("Unable to send your e-mail. Please try again.");
        }
    });
}