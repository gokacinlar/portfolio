import BaseComponent from "../utils/helpers/baseComponent";

export class LazyImage extends BaseComponent {
    private _imgElement: HTMLImageElement | null = null;

    static get observedAttributes(): string[] {
        return ["class", "src", "srcset", "alt", "width"];
    }

    render(): string {
        const className = this.getAttribute("class");
        const src = this.getAttribute("src");
        const srcset = this.getAttribute("srcset");
        const alt = this.getAttribute("alt");
        const imgElement = this._imgElement ?? document.createElement("img");

        this._imgElement = imgElement;

        for (const child of Array.from(this.childNodes)) {
            if (child !== imgElement) {
                child.remove();
            }
        }

        imgElement.className = className || "d-flex";
        imgElement.src = src || "";
        imgElement.srcset = srcset || "";
        imgElement.alt = alt || "Lazy Image";
        imgElement.title = alt || "Lazy Image";
        imgElement.loading = "lazy";
        imgElement.decoding = "async";
        imgElement.style.width = "";
        imgElement.style.height = "";
        imgElement.removeAttribute("width");

        const widthVal = this.getAttribute("width");
        if (widthVal?.includes("%")) {
            imgElement.style.width = widthVal;
            imgElement.style.height = "auto";
        } else if (widthVal) {
            const pxWidth = Number.parseInt(widthVal, 10);

            if (!Number.isNaN(pxWidth)) {
                imgElement.width = pxWidth;
            }
        }

        if (imgElement.parentNode !== this) {
            this.appendChild(imgElement);
        }

        return "";
    }
}

customElements.define("component-lazy-image", LazyImage);
export default LazyImage;
