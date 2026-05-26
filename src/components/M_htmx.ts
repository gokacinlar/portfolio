import DOMPurify from "dompurify";
import CustomWebHaptics from "../utils/webHaptics";
import * as type from "../ts/interfaces/i.global";

export class HtmxControls {
    private webHaptics = new CustomWebHaptics();
    constructor(private options: type.HTMXOptions) { }

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