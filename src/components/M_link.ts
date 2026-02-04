class AnchorLink extends HTMLElement {
    private _anchorElement: HTMLAnchorElement | null = null;
    private _isSetUp: boolean = false;

    constructor() {
        super();
    }

    private render(): void {
        const href = this.getAttribute("href");
        const text = this.getAttribute("textContent");
        const type = this.getAttribute("type");
        const title = this.getAttribute("title");
        const referrerpolicy = this.getAttribute("referrerpolicy");
        const target = this.getAttribute("target");
        const downloadAttr = this.getAttribute("download");

        let anchorElement = this._anchorElement;

        if (!anchorElement) {
            anchorElement = document.createElement("a") as HTMLAnchorElement;
            this._anchorElement = anchorElement;
        }

        anchorElement.textContent = text || title || "N/A";
        anchorElement.className = "link-primary link-offset-2 link-underlinae-opacity-25 link-underline-opcity-100-hover";
        anchorElement.href = href || "#";
        anchorElement.title = title || "N/A";
        anchorElement.target = target || "_parent";
        anchorElement.referrerPolicy = referrerpolicy || "strict-origin-when-cross-origin";
        anchorElement.rel = "noopener noreferrer"
        anchorElement.type = type || "text/html";
        if (downloadAttr !== null) anchorElement.download = downloadAttr || "";

        this._anchorElement = anchorElement;

        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        this.appendChild(anchorElement);
    }

    static get observedAttributes(): string[] {
        return ["href", "title", "text", "target", "referrerpolicy", "download"];
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
        oldValue: string,
        newValue: string
    ): void {
        if (this.isConnected && oldValue !== newValue) {
            this.render();
        }
    }

    async disconnectedCallback(): Promise<void> {
        await Promise.resolve();
        if (!this.isConnected && this._isSetUp) {
            this.remove();
            this._isSetUp = false
        }
    }
}

customElements.define("component-anchor-link", AnchorLink);
export default AnchorLink;