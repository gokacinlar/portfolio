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
    ];

    // Get cached items
    private async getCachedItems(): Promise<Response[]> {
        const cache = await caches.open(this.cacheName);
        const cachedResponses: Response[] = [];

        for (const item of EffectiveCaching.ITEMS_TO_BE_CACHED) {
            const response = await cache.match(item);
            if (response) {
                cachedResponses.push(response);
            }
        }

        return cachedResponses;
    }

    // Insert items into cache
    private async insertCachedItems(): Promise<void> {
        const cache = await caches.open(this.cacheName);

        for (const item of EffectiveCaching.ITEMS_TO_BE_CACHED) {
            const response = await fetch(item);
            if (response.ok) {
                await cache.put(item, response);
            }
        }
    }

    // Public method to ensure cache exists and is populated
    public async ensureCache(): Promise<Response[]> {
        const cachedItems = await this.getCachedItems();

        if (cachedItems.length > 0) {
            return cachedItems; // Already cached
        } else {
            await this.insertCachedItems();
            return this.getCachedItems();
        }
    }
}