import DOMPurify from "dompurify";
import { domSanitizeOptions } from "../../domSanitizeOptions";
import { applyNonce, getNonce } from "./nonce";

// Create a template content to be appended to every Light DOM
export class Template {
	private nonce: string;
	constructor() {
		this.nonce = getNonce();
	}

	public createTemplate(
		content: string,
		target: HTMLElement,
	): HTMLTemplateElement {
		if (typeof content !== "string" || !content.trim()) {
			throw new Error("Template content must be a non-empty string");
		}

		const template = document.createElement("template") as HTMLTemplateElement;
		const sanitizedContent = DOMPurify.sanitize(content, domSanitizeOptions);
		template.innerHTML = sanitizedContent;
		try {
			if (!content || !target) {
				throw new Error("Content or target does not exist.");
			}

			const fragment = template.content.cloneNode(true) as DocumentFragment;
			// Add nonce to all style and script elements if nonce exists
			if (this.nonce) {
				fragment.querySelectorAll("style, script").forEach((element) => {
					applyNonce(
						element as HTMLScriptElement | HTMLStyleElement,
						this.nonce,
					);
				});
			}

			target.appendChild(fragment);
			return template;
		} catch (error: unknown) {
			throw new Error(
				"Unable to append template content as a web component: " + error,
			);
		}
	}
}
