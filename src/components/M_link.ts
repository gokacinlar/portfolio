class AnchorLink extends HTMLElement {
    private _anchorElement: HTMLAnchorElement | null = null;
    private _isSetUp: boolean = false;

    constructor() {
        super();
    }

    private render(): void {
        const href = this.getAttribute("href");
        const text = this.getAttribute("text");
        const type = this.getAttribute("type");
        const title = this.getAttribute("title");
        const referrerpolicy = this.getAttribute("referrerpolicy");
        const target = this.getAttribute("target");
        const downloadAttr = this.getAttribute("download");

        let anchorElement = this._anchorElement;

        if (!anchorElement) {
            anchorElement = document.createElement("a");
            this._anchorElement = anchorElement;
        }

        const componentToBePreserved =
            this.querySelector(":scope > component-lazy-image") ?? anchorElement.querySelector(":scope > component-lazy-image");

        // Remove the host's existing children, including the old anchor.
        this.replaceChildren();

        anchorElement.className = "link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover w-100";
        anchorElement.href = href || "#";
        anchorElement.title = title || "N/A";
        anchorElement.target = target || "_parent";
        anchorElement.referrerPolicy =
            referrerpolicy || "strict-origin-when-cross-origin";
        anchorElement.rel = "opener";
        anchorElement.type = type || "text/html";

        if (downloadAttr !== null) {
            anchorElement.download = downloadAttr;
        } else {
            anchorElement.removeAttribute("download");
        }

        // Remove the anchor's previous content.
        anchorElement.replaceChildren();

        if (componentToBePreserved) {
            anchorElement.appendChild(componentToBePreserved);
        } else {
            anchorElement.textContent = text || title || "N/A";
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

    disconnectedCallback(): void {
        this._isSetUp = false;
    }
}

customElements.define("component-anchor-link", AnchorLink);
export default AnchorLink;