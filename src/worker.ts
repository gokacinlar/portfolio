import type { ServiceWorkerGlobalScopeLike, ExtendableEventLike, FetchEventLike } from "./ts/interfaces/i.global";
import EffectiveCaching from "./utils/cache";

const caching = new EffectiveCaching();
const serviceWorker = self as unknown as ServiceWorkerGlobalScopeLike;

self.addEventListener("install", (event) => {
    const installEvent = event as unknown as ExtendableEventLike;
    installEvent.waitUntil(caching.install().then(() => serviceWorker.skipWaiting()));
});

self.addEventListener("activate", (event) => {
    const activateEvent = event as unknown as ExtendableEventLike;
    activateEvent.waitUntil(caching.cleanup().then(() => serviceWorker.clients.claim()));
});

self.addEventListener("fetch", (event) => {
    const fetchEvent = event as unknown as FetchEventLike;
    const { request } = fetchEvent;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);
    if (url.origin !== self.location.origin) {
        return;
    }

    fetchEvent.respondWith(caching.handleRequest(request));
});
