class AnchorLink extends HTMLElement {
    private _anchorElement: HTMLAnchorElement | null = null;

    constructor() {
        super();
    }

    private render(): void {
        const href = this.getAttribute("href");
        const text = this.getAttribute("textContent");
        const title = this.getAttribute("title");
        const referrerpolicy = this.getAttribute("referrerpolicy");
        const target = this.getAttribute("target");
        const anchorElement = document.createElement("a") as HTMLAnchorElement;

        anchorElement.textContent = text || title || "N/A";
        anchorElement.className = "link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover";
        anchorElement.href = href || "#";
        anchorElement.title = title || "N/A";
        anchorElement.target = target || "_parent";
        anchorElement.referrerPolicy = referrerpolicy || "strict-origin-when-cross-origin";
        anchorElement.rel = "noopener noreferrer"
        anchorElement.type = "text/html";

        this._anchorElement = anchorElement;

        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        this.appendChild(anchorElement);
    }

    static get observedAttributes(): string[] {
        return ["src", "title"];
    }

    get src(): string | null {
        return this.getAttribute("src");
    }

    set src(value: string | null) {
        if (value) {
            this.setAttribute("src", value);
        } else {
            this.removeAttribute("src");
        }
    }

    connectedCallback(): void {
        this.render();
    }

    attributeChangedCallback(
        _name: string,
        oldValue: string,
        newValue: string
    ): void {
        if (this.isConnected && oldValue !== newValue) {
            this.render();
        }
    }
}

customElements.define("component-anchor-link", AnchorLink);
export default AnchorLink;