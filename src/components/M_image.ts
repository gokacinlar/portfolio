class LazyImage extends HTMLElement {
    private _imgElement: HTMLImageElement | null = null;
    private _isConnected: boolean = false;

    constructor() {
        super();
    }

    private render(): void {
        const src = this.getAttribute("src");
        const alt = this.getAttribute("alt");
        const width = this.getAttribute("width");
        const height = this.getAttribute("height");

        if (!src) {
            console.warn("No image source provided");
            return;
        }

        const imgElement = document.createElement("img") as HTMLImageElement;
        imgElement.src = src;
        imgElement.alt = alt || "Unknown";
        imgElement.title = alt || "Unknown";
        imgElement.loading = "lazy";
        imgElement.decoding = "async";

        if (width && height) {
            imgElement.width = parseInt(width);
            imgElement.height = parseInt(height);
        }

        this._imgElement = imgElement;
        this.appendChild(imgElement);
    }

    static get observedAttributes(): string[] {
        return ["src", "alt", "width", "height", "loading"];
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
        this._isConnected = true;
        this.render();
    }

    disconnectedCallback(): void {
        this._isConnected = false;
    }

    attributeChangedCallback(
        _name: string,
        oldValue: string,
        newValue: string
    ): void {
        if (this._isConnected && oldValue !== newValue) {
            this.render();
        }
    }
}

customElements.define("component-lazy-image", LazyImage);
export default LazyImage;