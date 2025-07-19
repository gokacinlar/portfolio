interface HTMXOptions {
    hxget: string;
    hxtrigger: string;
    hxswap: string;
    hxpushurl: string;
}

export class HtmxControls {
    constructor(private options: HTMXOptions) { }

    public render(): string {
        const { hxget, hxtrigger, hxswap, hxpushurl } = this.options;
        return `
            hx-get="${hxget}"
            hx-trigger="${hxtrigger}"
            hx-swap="${hxswap}"
            hx-push-url="${hxpushurl}"
        `.trim();
    }
}