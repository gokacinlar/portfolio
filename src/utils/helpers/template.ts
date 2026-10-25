import DOMPurify from "dompurify";
import { domSanitizeOptions } from "../../domSanitizeOptions";

// Function to generate nonce for each script tag
export function generateNonce(): string {
    try {
        // csp-html-webpack-plugin adds nonce to script tags automatically
        const scriptWithNonce = document.querySelector("script[nonce]") as HTMLScriptElement;
        if (scriptWithNonce) {
            return scriptWithNonce.getAttribute("nonce") || "";
        }

        // check nonce in styletags
        const styleWithNonce = document.querySelector("style[nonce]") as HTMLStyleElement;
        if (styleWithNonce) {
            return styleWithNonce.getAttribute("nonce") || "";
        }

        console.warn("No nonce found. CSP may block dynamic content.");
        return "";
    } catch (error: unknown) {
        console.error("Error retrieving nonce:", error);
        return "";
    }
}

// Create a template content to be appended to every Light DOM
export class Template {
    private nonce: string;
    constructor() { this.nonce = generateNonce() };

    public createTemplate(content: string, target: HTMLElement): HTMLTemplateElement {
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
                    element.setAttribute("nonce", this.nonce);
                });
            }

            target.appendChild(fragment);
            return template;
        } catch (error: unknown) {
            throw new Error("Unable to append template content as a web component: " + error);
        }
    }
}
