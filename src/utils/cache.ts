interface CacheOptions {
    version?: number;
    maxEntries?: number;
    maxAgeSeconds?: number;
    strategy?: "cache-first" | "network-first" | "stale-while-revalidate" | "cache-only" | "network-only";
}

class EffectiveCaching {
    private cacheName: string;
    private options: CacheOptions;

    constructor(cacheName = "dervisoksuzoglu-cache-v1", options: CacheOptions = {}) {
        this.cacheName = cacheName;
        this.options = {
            version: options.version ?? 1,
            maxEntries: options.maxEntries ?? 100,
            maxAgeSeconds: options.maxAgeSeconds ?? 86400,
            strategy: options.strategy ?? "cache-first"
        };
    }

    private static readonly ITEMS_TO_BE_CACHED: Array<string> = [
        "../assets/fonts",
        "../assets/images",
        "../assets/json",
        "../assets/videos",
        "../index.html"
    ];

    // Get cached items
    private async getCachedItems(): Promise<Response[]> {
        const cache = await caches.open(this.cacheName);
        const cachedResponses: Response[] = [];

        for (const item of EffectiveCaching.ITEMS_TO_BE_CACHED) {
            if (this.isExpired(item)) {
                // If expiration is due, delete
                await cache.delete(item);
                localStorage.removeItem(`${this.cacheName}:${item}:timestamp`);
                continue;
            }

            const response = await cache.match(item);
            if (response) {
                cachedResponses.push(response);
            }
        }

        return cachedResponses;
    }

    private async insertCachedItems(): Promise<void> {
        const cache = await caches.open(this.cacheName);

        for (const item of EffectiveCaching.ITEMS_TO_BE_CACHED) {
            try {
                const response = await fetch(item);
                if (response.ok) {
                    // Clone the response before caching
                    const responseToCache = response.clone();
                    await cache.put(item, responseToCache);
                    this.setCacheTimestamp(item);
                }
            } catch (error) {
                console.error(`Failed to fetch and cache ${item}:`, error);
            }
        }
    }

    public async ensureCache(): Promise<Response[]> {
        const cachedItems = await this.getCachedItems();

        if (cachedItems.length > 0) {
            return cachedItems; // Already cached
        } else {
            await this.insertCachedItems();
            return this.getCachedItems();
        }
    }

    // Function to set timestamp for cache's creation date to be later deleted w/expiration period
    private setCacheTimestamp(item: string): void {
        const now: number = Date.now();
        localStorage.setItem(`${this.cacheName}:${item}:timestamp`, now.toString());
    }

    private getCacheTimestamp(item: string): number | null {
        const ts = localStorage.getItem(`${this.cacheName}:${item}:timestamp`);
        return ts ? parseInt(ts, 10) : null;
    }

    private isExpired(item: string): boolean {
        const ts = this.getCacheTimestamp(item);
        if (!ts) {
            return true;
        } else {
            const age: number = (Date.now() - ts) / 1000;
            return age > (this.options.maxAgeSeconds ?? 86400);
        }
    }
}

export default EffectiveCaching;