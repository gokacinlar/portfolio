import type * as bootstrap from "bootstrap";
import * as bootstrap from "bootstrap";

declare global {
    interface Window {
        bootstrap: typeof bootstrap;
    }
}

declare module "simple-parallax-js/vanilla" {
    export default class SimpleParallax {
        constructor(elements: HTMLElement | NodeList | HTMLElement[], options?: any);
        refresh(): void;
        destroy(): void;
    }
}