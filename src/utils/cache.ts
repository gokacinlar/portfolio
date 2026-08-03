import type * as iface from "../ts/interfaces/i.global";

class EffectiveCaching {
    public static readonly PRECACHE_URLS: readonly string[] = [
        "/",
        "/index.html",
        "/about.html",
        "/work.html",
        "/updates.html",
        "/404.html",
        "/assets/images/favicon/favicon.ico",
        "/assets/images/static/webp/logo.webp",
        "/assets/images/static/webp/logo_24x24.webp",
        "/assets/images/static/webp/logo_256x256.webp",
        "/assets/images/static/webp/logo_512x512.webp",
        "/assets/images/static/webp/qualifications-main-english.webp",
        "/assets/images/static/webp/qualifications-main-webdev.webp",
        "/assets/images/static/svg/cc-zero.svg",
        "/assets/images/static/svg/github.svg",
        "/assets/images/static/svg/hnode.svg",
        "/assets/images/static/svg/js.svg",
        "/assets/images/static/svg/mongodb.svg",
        "/assets/images/static/svg/mysql.svg",
        "/assets/images/static/svg/notbyai.svg",
        "/assets/images/static/svg/parabolic-rectangle.svg",
        "/assets/images/static/svg/php.svg",
        "/assets/images/static/svg/postgrsql.svg",
        "/assets/images/static/svg/py.svg",
        "/assets/images/static/svg/react.svg",
        "/assets/images/static/svg/sqlite.svg",
        "/assets/images/static/svg/TE_alphabet.svg",
        "/assets/images/static/svg/TE_booklet.svg",
        "/assets/images/static/svg/TE_book.svg",
        "/assets/images/static/svg/TE_brightness.svg",
        "/assets/images/static/svg/TE_globe.svg",
        "/assets/images/static/svg/TE_keywords.svg",
        "/assets/images/static/svg/TE_lang.svg",
        "/assets/images/static/svg/TE_quote.svg",
        "/assets/images/static/svg/TE_reception.svg",
        "/assets/images/static/svg/tr.svg",
        "/assets/images/static/svg/ts.svg",
        "/assets/images/static/svg/uk.svg",
        "/assets/images/static/svg/wp.svg",
        "/assets/images/static/svg/x-twitter.svg"
    ];

    private readonly cacheName: string;
    private readonly options: iface.CacheOptions;

    constructor(cacheName = "dervisoksuzoglu-cache", options: iface.CacheOptions = {}) {
        this.cacheName = `${cacheName}-v${options.version ?? 1}`;
        this.options = {
            version: options.version ?? 1,
            maxEntries: options.maxEntries ?? 100,
            maxAgeSeconds: options.maxAgeSeconds ?? 86400,
            strategy: options.strategy ?? "cache-first"
        };
    }

    public get name(): string {
        return this.cacheName;
    }

    // Initiate cache based on objects defined in PRECACHE_URLS
    public async install(): Promise<void> {
        const cache = await caches.open(this.cacheName);

        await Promise.all(
            EffectiveCaching.PRECACHE_URLS.map(async (url) => {
                try {
                    const response = await fetch(url);
                    if (response.ok) {
                        await cache.put(url, response);
                    }
                } catch (error: unknown) {
                    throw new Error(`Failed to precache ${url}: ${error}`);
                }
            })
        );

        await this.trimCache(cache);
    }

    public async cleanup(): Promise<void> {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames
                .filter((name) => name !== this.cacheName)
                .map((name) => caches.delete(name))
        );
    }

    public async handleRequest(request: Request): Promise<Response> {
        const cache = await caches.open(this.cacheName);
        const url = request.url;

        const fetchAndCache = async (): Promise<Response> => {
            const networkResponse = await fetch(request);
            if (networkResponse.ok) {
                const responseToCache = networkResponse.clone();
                await cache.put(url, responseToCache);
                await this.trimCache(cache);
            }
            return networkResponse;
        };

        switch (this.options.strategy) {
            case "network-only":
                return fetchAndCache();
            case "network-first": {
                try {
                    return await fetchAndCache();
                } catch {
                    return (await cache.match(url)) ?? new Response("Network request failed.", { status: 503 });
                }
            }
            case "cache-only":
                return (await cache.match(url)) ?? new Response("Resource not cached.", { status: 404 });
            case "stale-while-revalidate": {
                const cached = await cache.match(url);
                if (cached) {
                    void fetchAndCache().catch(() => undefined);
                    return cached;
                }
                return fetchAndCache();
            }
            default: {
                const cached = await cache.match(url);
                if (cached && !this.isExpired(cached)) {
                    return cached;
                }
                try {
                    return await fetchAndCache();
                } catch {
                    return cached ?? new Response("Network request failed.", { status: 503 });
                }
            }
        }
    }

    private async trimCache(cache: Cache): Promise<void> {
        const { maxEntries } = this.options;

        if (maxEntries === undefined) {
            return;
        }

        const keys = await cache.keys();
        if (keys.length <= maxEntries) {
            return;
        }

        const entries = await Promise.all(
            keys.map(async (key) => ({ request: key, response: await cache.match(key) }))
        );

        const sorted = entries
            .filter((entry): entry is { request: Request; response: Response } => entry.response !== undefined)
            .sort(
                (a, b) =>
                    (this.responseTimestamp(b.response) ?? 0) - (this.responseTimestamp(a.response) ?? 0)
            );

        for (const entry of sorted.slice(maxEntries)) {
            await cache.delete(entry.request);
        }
    }

    private isExpired(response: Response): boolean {
        const { maxAgeSeconds } = this.options;
        if (maxAgeSeconds === undefined) {
            return false;
        }

        const timestamp = this.responseTimestamp(response);
        if (timestamp === null) {
            return false;
        }

        return (Date.now() - timestamp) / 1000 > maxAgeSeconds;
    }

    private responseTimestamp(response: Response): number | null {
        const dateHeader = response.headers.get("date");
        if (!dateHeader) {
            return null;
        }

        const timestamp = Date.parse(dateHeader);
        return Number.isNaN(timestamp) ? null : timestamp;
    }
}

export default EffectiveCaching;