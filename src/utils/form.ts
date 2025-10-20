import { validateEmail, generateNonce } from "../helper";

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
        const script = document.createElement("script");
        script.id = "web3forms-script";
        script.src = "https://web3forms.com/client/script.js";
        script.async = true;
        script.defer = true;
        script.nonce = ng;

        script.onload = () => {
            resolve();
            console.log("Web3Forms script loaded successfully. Ready to accept e-mails.");
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
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            const formData = new FormData(form);
            const object: Object = Object.fromEntries(formData);
            const json: string = JSON.stringify(object);

            if (validateEmail(json) === true) {
                fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: json
                })
                    .then(async (response) => {
                        await response.json();
                        if (response.status == 200) {
                            console.log("Your e-mail has been sent.");
                        } else {
                            throw new Error("Something bad has happened: " + response);
                        }
                    })
                    .catch(error => {
                        throw new Error("Unable to fetch form data: " + error);
                    })
                    .then(function () {
                        form.reset();
                    });
            }
        });
    } else {
        throw new Error("Unable to detect form element.");
    }
}