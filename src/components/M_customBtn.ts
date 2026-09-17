class CustomButton extends HTMLElement {
    private _buttonElement: HTMLButtonElement | null = null;
    private _isSetUp: boolean = false;
    private boundHandleClick: ((e: MouseEvent) => void) | null = null;

    constructor() {
        super();
        this.boundHandleClick = this.handleClick.bind(this);
    }

    private render(): void {
        const href = this.getAttribute("href");
        const dataModal = this.getAttribute("data-modal");
        const className = this.getAttribute("class");
        const type = this.getAttribute("type");
        const role = this.getAttribute("role");
        const title = this.getAttribute("title");

        // Create or update button
        let buttonElement = this._buttonElement;
        if (!buttonElement) {
            buttonElement = document.createElement("button") as HTMLButtonElement;
            this._buttonElement = buttonElement;
            if (this.boundHandleClick) {
                buttonElement.addEventListener("click", this.boundHandleClick);
            }
        }

        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        if (href) buttonElement.setAttribute("aria-label", `Go to ${href}`);
        if (dataModal) buttonElement.setAttribute("data-modal", dataModal);
        if (className) buttonElement.className = className;
        if (type) buttonElement.type = type as "button" | "submit" | "reset";
        if (role) buttonElement.role = role || "";
        if (title) buttonElement.title = title;

        this.appendChild(buttonElement);
    }

    private handleClick(event: MouseEvent): void {
        const href = this.getAttribute("href");
        if (href) {
            event.preventDefault();
            window.location.href = href;
        }
    }

    static get observedAttributes(): string[] {
        return ["href", "class", "type", "title", "text"];
    }

    get src(): string | null {
        return this.getAttribute("href");
    }

    set src(value: string | null) {
        if (value) {
            this.setAttribute("href", value);
        } else {
            this.removeAttribute("href");
        }
    }

    connectedCallback(): void {
        this.render();
        this._isSetUp = true;
    }

    attributeChangedCallback(
        _name: string,
        oldValue: string | undefined,
        newValue: string | null
    ): void {
        if (this.isConnected && this._isSetUp && oldValue !== newValue) {
            this.render();
        }
    }

    disconnectedCallback(): void {
        if (this._buttonElement && this.boundHandleClick) {
            this._buttonElement.removeEventListener("click", this.boundHandleClick);
        }
        this._isSetUp = false;
    }
}

customElements.define("component-custom-button", CustomButton);
export default CustomButton;
