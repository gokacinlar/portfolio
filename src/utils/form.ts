import { generateNonce, insertToastifiedMessage } from "../utils/helper";

// Handle web3forms hCaptcha request
export function loadWeb3Forms(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.getElementById("web3forms-script")) {
            resolve();
            return;
        }

        // Init nonce generator
        const ng = generateNonce();

        // Append the script to page
        const script = document.createElement("script") as HTMLScriptElement;
        script.id = "web3forms-script";
        script.src = "https://web3forms.com/client/script.js";
        script.async = true;
        script.defer = true;
        script.nonce = ng;

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

    if (form) {
        form.addEventListener("submit", function (e: SubmitEvent) {
            e.preventDefault();
            const formData = new FormData(form);
            const object: Object = Object.fromEntries(formData);
            const json: string = JSON.stringify(object);
            const web3formsUrl: string = "https://api.web3forms.com/submit";

            try {
                fetch(web3formsUrl, {
                    method: "POST",
                    mode: "cors",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: json
                })
                    .then(async (response) => {
                        await response.json();
                        if (response && response.status == 200) {
                            insertToastifiedMessage("Your e-mail has been sent.");
                        } else {
                            insertToastifiedMessage("Unable to send your e-mail.");
                            throw new Error("Something bad has happened: " + response);
                        }
                    })
                    .catch(error => {
                        throw new Error("Unable to fetch form data: " + error);
                    })
                    .then(function () {
                        form.reset();
                    });
            } catch (error: unknown) {
                throw new Error(`Unable to fetch ${web3formsUrl}:` + error);
            }
        });
    } else {
        throw new Error("Unable to detect form element.");
    }
}