class GetSiteVersionNumber {
    private static readonly url: string = "https://api.github.com/repos/gokacinlar/portfolio/tags";
    private _version: string = "Loading...";

    private async fetchPhpFile(targetUrl: string): Promise<any> {
        try {
            const response = await fetch(targetUrl, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            throw error;
        }
    }

    public async scrape(): Promise<string> {
        const data = await this.fetchPhpFile(GetSiteVersionNumber.url);
        if (data) {
            return data[0].name;
        } else {
            return "N/A";
        }
    }

    public get version(): string {
        return this._version;
    }

    public set version(version: string) {
        version = this._version;
    }

    public async init(): Promise<void> {
        this._version = await this.scrape();
    }
}

export default GetSiteVersionNumber;
