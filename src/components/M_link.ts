import BaseComponent from "../utils/helpers/baseComponent";

class AnchorLink extends BaseComponent {
	private _anchorElement: HTMLAnchorElement | null = null;

	static get observedAttributes(): string[] {
		return [
			"href",
			"text",
			"type",
			"title",
			"referrerpolicy",
			"target",
			"download",
			"hreflang",
		];
	}

	render(): string {
		const href = this.getAttribute("href");
		const text = this.getAttribute("text");
		const type = this.getAttribute("type");
		const title = this.getAttribute("title");
		const referrerpolicy = this.getAttribute("referrerpolicy");
		const target = this.getAttribute("target") || "_parent";
		const downloadAttr = this.getAttribute("download");
		const hreflang = this.getAttribute("hreflang");
		const anchorElement = this._anchorElement ?? document.createElement("a");

		this._anchorElement = anchorElement;

		const componentToBePreserved =
			this.querySelector(":scope > component-lazy-image") ??
			anchorElement.querySelector(":scope > component-lazy-image");

		// Remove the host's existing children, including the old anchor.
		this.replaceChildren();

		anchorElement.className =
			"link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover w-100";
		anchorElement.href = href || "#";
		anchorElement.title = title || "N/A";
		anchorElement.target = target;
		anchorElement.referrerPolicy =
			referrerpolicy || "strict-origin-when-cross-origin";
		anchorElement.type = type || "text/html";

		if (target === "_blank") {
			anchorElement.rel = "noopener noreferrer";
		} else {
			anchorElement.removeAttribute("rel");
		}

		if (hreflang) {
			anchorElement.hreflang = hreflang;
		} else {
			anchorElement.removeAttribute("hreflang");
		}

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

		return "";
	}
}

customElements.define("component-anchor-link", AnchorLink);
export default AnchorLink;
