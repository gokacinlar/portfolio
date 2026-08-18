import { RequiredCallbacksOnComponent } from "../ts/interfaces/i.callback";
import { Template } from "../utils/helper";

class ClientSideLoginPage extends HTMLElement implements RequiredCallbacksOnComponent {
    private form: HTMLFormElement | null = null;
    private handleSubmit: ((e: Event) => void) | null = null;

    constructor() {
        super();
        new Template().createTemplate(ClientSideLoginPage.template(), this);
    }

    private static template(): string {
        return /*html*/ `
            <section class="d-flex flex-row align-items-center justify-content-center" style="min-height: 100dvh; background: var(--clr-one);">
                <form id="loginForm" class="d-flex flex-column gap-3 p-4 w-100" style="max-width: 400px;">
                    <h2 class="text-center fw-bold mb-2" style="color: var(--clr-two);">Admin Login</h2>

                    <div class="d-flex flex-column gap-1">
                        <label for="username" class="form-label fw-medium" style="color: var(--clr-two);">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            class="form-control form-control-lg rounded-5"
                            placeholder="Enter username"
                            autocomplete="username"
                            required
                        >
                    </div>

                    <div class="d-flex flex-column gap-1">
                        <label for="password" class="form-label fw-medium" style="color: var(--clr-two);">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            class="form-control form-control-lg rounded-5"
                            placeholder="Enter password"
                            autocomplete="current-password"
                            required
                        >
                    </div>

                    <div id="loginError" class="text-danger text-center fw-medium" style="display: none;"></div>

                    <button
                        type="submit"
                        id="loginSubmitBtn"
                        class="bee-color-btn bg-gradient btn btn-lg rounded-5 fw-bold shadow-sm"
                    >
                        Login
                    </button>

                    <a href="/" class="text-center text-decoration-none fw-medium" style="color: var(--clr-two);">
                        &larr; Back to portfolio
                    </a>
                </form>
            </section>
        `;
    }

    connectedCallback(): void {
        this.form = this.querySelector("#loginForm") as HTMLFormElement;
        this.handleSubmit = this.onSubmit.bind(this);
        this.form?.addEventListener("submit", this.handleSubmit);
    }

    disconnectedCallback(): void {
        this.form?.removeEventListener("submit", this.handleSubmit!);
    }

    // Listen for submit
    private async onSubmit(e: Event): Promise<void> {
        e.preventDefault();

        const btn = this.querySelector("#loginSubmitBtn") as HTMLButtonElement;
        // Basic trimming
        const username = (this.querySelector("#username") as HTMLInputElement).value.trim();
        const password = (this.querySelector("#password") as HTMLInputElement).value;

        this.hideError();

        if (!username || !password) {
            this.showError("Please fill in all fields.");
            return;
        }

        btn.disabled = true;
        btn.textContent = "Logging in...";

        try {
            const response = await fetch("/php/Login.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ username, password }).toString(),
                credentials: "include"
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Redirect to panel, which is separate from all the
                // SPA layer
                window.location.href = "/php/Panel.php";
            } else {
                this.showError(data.message || "Invalid credentials.");
            }
        } catch {
            this.showError("Something went wrong. Please try again.");
        } finally {
            btn.disabled = false;
            btn.textContent = "Login";
        }
    }

    private showError(message: string): void {
        const el = this.querySelector("#loginError") as HTMLElement;
        el.textContent = message;
        el.style.display = "block";
    }

    private hideError(): void {
        const el = this.querySelector("#loginError") as HTMLElement;
        el.textContent = "";
        el.style.display = "none";
    }
}

customElements.define("app-admin", ClientSideLoginPage);
export default ClientSideLoginPage;
