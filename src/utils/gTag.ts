import Analytics, { AnalyticsInstance } from "analytics";
import googleAnalytics from "@analytics/google-analytics";


class GoogleAnalytics {
    public static readonly ANALYTICS_KEY: Array<string> = ["G-XMT56BGFP8"];
    public analytics: AnalyticsInstance;

    constructor() {
        this.analytics = Analytics({
            app: "portfolio",
            version: 100,
            plugins: [
                googleAnalytics({
                    measurementIds: GoogleAnalytics.ANALYTICS_KEY,
                }),
            ],
        });
    }

    public trackPage(): void {
        this.analytics.page();
    }
}

export default GoogleAnalytics;