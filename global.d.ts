import type * as bootstrap from "bootstrap";

// Bootstrap Window declaration
declare global {
    interface Window {
        bootstrap: typeof bootstrap;
    }
}
