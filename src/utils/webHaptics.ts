import { WebHaptics, defaultPatterns } from "web-haptics";
import * as type from "../ts/interfaces/i.global";

class CustomWebHaptics {
    private static readonly patterns = defaultPatterns;
    private static instance: CustomWebHaptics | null = null;
    private cHaptics: WebHaptics | null = null;
    private windowNavigator: Navigator = navigator;
    private isReady: boolean = false;

    constructor() {
        this.initWebHaptics();
    }

    // Singleton pattern - always use the same instance
    public static getInstance(): CustomWebHaptics {
        if (!CustomWebHaptics.instance) {
            CustomWebHaptics.instance = new CustomWebHaptics();
        }

        return CustomWebHaptics.instance;
    }

    private initWebHaptics(): void {
        // Check if Web Haptics API is supported
        if (!this.windowNavigator.vibrate) {
            console.warn("Web Haptics API is not supported on this device. Events will only play sounds.");
        }

        if (!WebHaptics.isSupported) {
            console.warn("Vibration API is not supported. Events will only play sounds.");
        }

        try {
            this.cHaptics = new WebHaptics({
                debug: true
            });
            this.isReady = true;
        } catch (error) {
            console.error("Failed to initialize Web Haptics:", error);
            this.isReady = false;
        }
    }

    public triggerHaptic(patternName: keyof type.WebHapticPatterns): void {
        if (!this.isReady || !this.cHaptics) {
            console.warn("Web Haptics not ready. Device may not support haptics.");
            return;
        }

        try {
            const pattern = CustomWebHaptics.patterns[patternName];
            if (!pattern) {
                console.error(`Pattern "${patternName}" not found.`);
                return;
            }

            // Trigger the haptic pattern
            this.cHaptics.trigger(pattern.pattern);
        } catch (error) {
            console.error("Error triggering haptic:", error);
        }
    }
}

export default CustomWebHaptics;
