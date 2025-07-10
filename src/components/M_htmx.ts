import * as Type from "../types";

export class HtmxControls {
    private hxget: string;
    private hxtrigger: string;
    private hxswap: string;
    private hxpushurl: string;

    constructor(options: any) {
        this.hxget = options.hxget;
        this.hxtrigger = options.hxtrigger;
        this.hxswap = options.hxswap;
        this.hxpushurl = options.hxpushurl;
    }

    public render(): string {
        return `
            hx-get="${this.hxget}"
            hx-trigger="${this.hxtrigger}"
            hx-swap="${this.hxswap}"
            hx-push-url="${this.hxpushurl}"
        `.trim();
    }
}