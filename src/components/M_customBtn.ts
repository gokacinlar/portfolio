import BaseComponent from "../utils/helpers/baseComponent";

export class CustomButton extends BaseComponent {
    private _buttonElement: HTMLButtonElement | null = null;

    static get observedAttributes(): string[] {
        return ["href", "data-modal", "class", "type", "role", "title"];
    }

    private _handleClick = (event: MouseEvent): void => {
        const href = this.getAttribute("href");

        if (href) {
            event.preventDefault();
            window.location.href = href;
        }
    };

    render(): string {
        const href = this.getAttribute("href");
        const dataModal = this.getAttribute("data-modal");
        const className = this.getAttribute("class");
        const type = this.getAttribute("type");
        const role = this.getAttribute("role");
        const title = this.getAttribute("title");

        const buttonElement = this._buttonElement ?? document.createElement("button");
        this._buttonElement = buttonElement;

        for (const child of Array.from(this.childNodes)) {
            if (child !== buttonElement) {
                buttonElement.appendChild(child);
            }
        }

        if (href) {
            buttonElement.setAttribute("aria-label", `Go to ${href}`);
        } else {
            buttonElement.removeAttribute("aria-label");
        }

        if (dataModal) {
            buttonElement.setAttribute("data-modal", dataModal);
        } else {
            buttonElement.removeAttribute("data-modal");
        }

        if (className) {
            buttonElement.className = className;
        } else {
            buttonElement.removeAttribute("class");
        }

        if (type === "button" || type === "submit" || type === "reset") {
            buttonElement.type = type;
        } else {
            buttonElement.removeAttribute("type");
        }

        if (role) {
            buttonElement.role = role;
        } else {
            buttonElement.removeAttribute("role");
        }

        if (title) {
            buttonElement.title = title;
        } else {
            buttonElement.removeAttribute("title");
        }

        if (buttonElement.parentNode !== this) {
            this.appendChild(buttonElement);
        }

        return "";
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.addEventListener("click", this._handleClick);
    }

    disconnectedCallback(): void {
        this.removeEventListener("click", this._handleClick);
    }
}

customElements.define("component-custom-button", CustomButton);
export default CustomButton;
