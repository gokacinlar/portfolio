import type { NonceElement } from "../../ts/types/types";

// CSP nonce helpers
// Browsers hide the nonce content attribute after parsing, so the nonce IDL
// property is the reliable source for the nonce of the current page
export function getNonce(): string {
	const nonceElement =
		(document.querySelector("script[nonce]") as NonceElement | null) ??
		(document.querySelector("style[nonce]") as NonceElement | null);

	const nonce = nonceElement?.nonce || nonceElement?.getAttribute("nonce");

	if (!nonce) {
		console.warn("No nonce found. CSP may block dynamic content.");
	}

	return nonce ?? "";
}

export function applyNonce(element: NonceElement, nonce: string = getNonce()): void {
	element.nonce = nonce;
}
