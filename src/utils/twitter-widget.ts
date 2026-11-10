import type * as iFace from "../ts/interfaces/i.global";
import { applyNonce, getNonce } from "./helpers/nonce";

const TWITTER_WIDGET_SRC: string = "https://platform.twitter.com/widgets.js";

// Re-scans the document and renders every embed that is not converted yet,
// needed after new content is injected (SPA navigation between posts)
export function renderTwitterWidgets(): void {
    const twttr = (window as iFace.TwitterGlobal).twttr;

    if (twttr?.widgets) {
        twttr.widgets.load();
    }
}

export function loadTwitterWidget(): void {
    if ((window as iFace.TwitterGlobal).twttr) {
        renderTwitterWidgets();
        return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = TWITTER_WIDGET_SRC;

    script.setAttribute("charset", "utf-8");
    const nonce = getNonce();
    if (nonce) {
        applyNonce(script, nonce);
    }

    script.onload = () => {
        renderTwitterWidgets();
    };
    script.onerror = () => {
        console.error("Failed to load the Twitter widget script.");
    };
    document.head.appendChild(script);
}
