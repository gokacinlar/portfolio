import "toastify-js/src/toastify.css"
import Toastify from "toastify-js";

// Centralized Toastify configuration
export const TOAST_CONFIG = {
    duration: 2500,
    newWindow: true,
    close: true,
    avatar: "../assets/images/static/webp/logo_24x24.webp",
    gravity: "bottom",
    position: "center",
    stopOnFocus: true,
    style: {
        background: "#0f3d75",
        borderRadius: "24px",
        text: "center"
    },
} as const;

export function insertToastifiedMessage(message: string) {
    try {
        const msg = message as string;
        if (msg) {
            Toastify({
                ...TOAST_CONFIG, // Using the centralized config
                text: msg,
                close: false,
                duration: 2500,
                ariaLive: "polite"
            }).showToast();
        }
    } catch (error: unknown) {
        throw new Error("Unable to insert toastify message" + error);
    }
}
