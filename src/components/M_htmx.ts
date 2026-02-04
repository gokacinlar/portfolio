import DOMPurify from "dompurify";

export interface HTMXOptions {
    hxget: string;
    hxtrigger: "click" | "change" | "mouseover";
    hxswap: "innerHTML" | "outerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend";
    hxpushurl: boolean;
}

export class HtmxControls {
    constructor(private options: HTMXOptions) { }

    public render(): string {
        if (!this.options) {
            throw new Error("At least one HTMX options must be selected. Now quitting...");
        }

        const { hxget, hxtrigger, hxswap, hxpushurl } = this.options;
        const base: string = `
            hx-get="${hxget}"
            hx-trigger="${hxtrigger}"
            hx-swap="${hxswap}"
            hx-push-url="${hxpushurl}"
        `;

        const sanitizedHTML = DOMPurify.sanitize(base);
        return sanitizedHTML.trim();
    }
}