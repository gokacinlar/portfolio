class LazyImage extends HTMLElement {
    private _imgElement: HTMLImageElement | null = null;
    private _isSetUp: boolean = false;

    constructor() {
        super();
    }

    private render(): void {
        const className = this.getAttribute("class");
        const src = this.getAttribute("src");
        const srcset = this.getAttribute("srcset");
        const alt = this.getAttribute("alt");

        let imgElement = this._imgElement;

        if (!imgElement) {
            imgElement = document.createElement("img") as HTMLImageElement;
            this._imgElement = imgElement;
        }

        imgElement.className = className || "d-flex";
        imgElement.src = src || "";
        imgElement.srcset = srcset || "";
        imgElement.alt = alt || "Lazy Image";
        imgElement.title = alt || "Lazy Image";
        imgElement.loading = "lazy";
        imgElement.decoding = "async";

        let widthVal = this.getAttribute("width");

        // Handle Width
        if (widthVal && widthVal.includes("%")) {
            imgElement.style.width = widthVal;
            imgElement.style.height = "auto";
        } else if (widthVal) {
            // Parse if pixel-based val is provided
            const pxWidth = parseInt(widthVal);

            if (!isNaN(pxWidth)) {
                imgElement.width = pxWidth;
            }
        }

        this._imgElement = imgElement;

        while (this.firstElementChild) {
            this.removeChild(this.firstElementChild);
        }

        this.appendChild(imgElement);
    }

    static get observedAttributes(): string[] {
        return ["class", "src", "srcset", "alt", "width", "loading"];
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

customElements.define("component-lazy-image", LazyImage);
export default LazyImage;