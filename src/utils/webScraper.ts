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
        if (data && data.length > 0 && data[0].name) {
            const result = data[0].name;

            this.addVersionNumberToLocalStorage(result);
            return result;
        } else {
            return "N/A";
        }
    }

    private addVersionNumberToLocalStorage(data: string): void {
        try {
            const localStorageKeyId: string = "version-number";
            const currentStoredVersion = localStorage.getItem(localStorageKeyId);;

            if (data !== currentStoredVersion) {
                localStorage.setItem(localStorageKeyId, data);
            }
        } catch (error: unknown) {
            console.error(`Unable to add site version number to local storage: ${error}`);
        }
    }

    public getSiteVersionFromLocalStorage(): string {
        try {
            const targetKey: string = "version-number";
            const storedVersion = localStorage.getItem(targetKey);

            if (!storedVersion) {
                return "N/A";
            }

            return storedVersion;
        } catch (error: unknown) {
            console.error(`Unable to get site version number from the local storage: ${error}`);
            return "N/A";
        }
    }

    public get version(): string {
        return this._version;
    }

    public set version(version: string) {
        this._version = version;
    }

    public async init(): Promise<void> {
        this._version = await this.scrape();
    }
}

export default GetSiteVersionNumber;