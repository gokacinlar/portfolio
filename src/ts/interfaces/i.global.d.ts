export interface WebHapticPatterns {
    success: [{ duration: 50 }, { delay: 50, duration: 50 }]
    nudge: [{ duration: 80, intensity: 0.8 }, { delay: 80, duration: 50, intensity: 0.3 }]
    error: [{ duration: 50, intensity: 0.75 }]
    buzz: [{ duration: 1000, intensity: 1 }]
}

export interface HTMXOptions {
    hxget: string;
    hxtrigger: "click" | "change" | "mouseover";
    hxswap: "innerHTML" | "outerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend";
    hxpushurl: boolean;
}

export interface NavLink {
    href: string;
    title: string;
    icon: string;
    htmxOptions?: Type.HTMXOptions;
}

export interface OptimizationOptions {
    dracoCompression?: boolean;
    quantize?: boolean;
    deduplication?: boolean;
    pruning?: boolean;
    welding?: boolean;
    meshOptimization?: "medium" | "high";
    verbose?: boolean;
}