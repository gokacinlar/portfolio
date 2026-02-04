class LazyImage extends HTMLElement {
    private _imgElement: HTMLImageElement | null = null;
    private _isSetUp: boolean = false;

    constructor() {
        super();
    }

    private render(): void {
        const src = this.getAttribute("src");
        const srcset = this.getAttribute("srcset");
        const alt = this.getAttribute("alt");
        const width = this.getAttribute("width");
        const height = this.getAttribute("height");

        let imgElement = this._imgElement;

        if (!imgElement) {
            imgElement = document.createElement("img") as HTMLImageElement;
            this._imgElement = imgElement;
        }

        imgElement.src = src || "";
        imgElement.srcset = srcset || "";
        imgElement.alt = alt || "Lazy Image";
        imgElement.title = alt || "Lazy Image";
        imgElement.loading = "lazy";
        imgElement.decoding = "async";

        if (width && height) {
            imgElement.width = parseInt(width);
            imgElement.height = parseInt(height);
        }

        this._imgElement = imgElement;

        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        this.appendChild(imgElement);
    }

    static get observedAttributes(): string[] {
        return ["src", "srcset", "alt", "width", "height", "loading"];
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

    async disconnectedCallback(): Promise<void> {
        await Promise.resolve();
        if (!this.isConnected && this._isSetUp) {
            this.remove();
            this._isSetUp = false
        }
    }
}

customElements.define("component-lazy-image", LazyImage);
export default LazyImage;