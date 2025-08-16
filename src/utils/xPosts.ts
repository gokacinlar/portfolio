import TwitterWidgetsLoader from "twitter-widgets";

class ListXPosts {
    private twitter: typeof TwitterWidgetsLoader;
    private id: string;
    private username: string;

    constructor(id: string, username: string) {
        this.id = id;
        this.username = username;
        this.twitter = TwitterWidgetsLoader;
        this.init();
    }

    private async init(): Promise<void> {
        try {
            const twttr = await this.loadTwitterWidgets();
            await this.createTimeline(twttr);
        } catch (error) {
            console.error("Error initializing Twitter widgets:", error);
        }
    }

    // Load tweets
    private loadTwitterWidgets(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.twitter.load((error: unknown, twttr: any) => {
                if (error) {
                    reject(new Error(`Unable to fetch X posts: ${error}`));
                } else {
                    console.log("Twitter widgets loaded successfully:", twttr);
                    resolve(twttr);
                }
            });
        });
    }

    // Create a timeline for collection of tweets
    private async createTimeline(twttr: any): Promise<void> {
        const tweetElement = document.getElementById(this.id) as HTMLElement;
        if (tweetElement) {
            try {
                await twttr.widgets.createTimeline(
                    {
                        sourceType: "profile",
                        screenName: this.username,
                        theme: "light",
                    },
                    document.getElementById(this.id)
                );
                console.log("Timeline successfully created");
            } catch (err: unknown) {
                console.error("Error creating timeline:", err);
            }
        } else {
            console.error("Timeline element not found");
        }
    }
}

export default ListXPosts;
