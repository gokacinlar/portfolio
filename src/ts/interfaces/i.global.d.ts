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

export interface CacheOptions {
    version?: number;
    maxEntries?: number;
    maxAgeSeconds?: number;
    strategy?: "cache-first" | "network-first" | "stale-while-revalidate" | "cache-only" | "network-only";
}

export interface ExtendableEventLike extends Event {
    waitUntil(promise: Promise<unknown>): void;
}

export interface FetchEventLike extends ExtendableEventLike {
    readonly request: Request;
    respondWith(response: Promise<Response> | Response): void;
}

export interface ServiceWorkerGlobalScopeLike {
    skipWaiting(): Promise<void>;
    readonly clients: {
        claim(): Promise<void>;
    };
}

// Blog
export interface Author {
    name: string;
}

export interface Post {
    id: string;
    title: string;
    author: Author;
    content: string;
    url: string;
}

export interface PostPreview {
    id: string;
    title: string;
    author: Author;
}

// *** GRAPHQL WordPress Backend Related *** //
export interface GraphQLCategoryNode {
    name: string;
    slug: string;
}

export interface GraphQLCategories {
    nodes: GraphQLCategoryNode[];
}

export interface GraphQLAuthorNode {
    name: string;
}

export interface GraphQLAuthor {
    node: GraphQLAuthorNode;
}

export interface GraphQLPostNode {
    id: string;
    title: string;
    date: string;
    slug: string;
    author: GraphQLAuthor;
    categories: GraphQLCategories;
    content: string;
}

export interface GraphQLPostsConnection {
    nodes: GraphQLPostNode[];
}

export interface GraphQLPostsData {
    posts: GraphQLPostsConnection;
}

// Single post query response
export interface GraphQLSinglePostData {
    post: GraphQLPostNode;
}

export interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}

// Domain types we'll convert from queries
export interface Author {
    name: string;
}

export interface Category {
    name: string;
    slug: string;
}

export interface Post {
    id: string;
    title: string;
    date: string;
    author: Author;
    content: string;
    url: string;
    categories: Category[];
}

// Lightweight post for initial listing
export interface PostPreview {
    id: string;
    title: string;
    author: Author;
    categories: Category[];
}

// Query variable type
export interface GetPostsVariables {
    first?: number;
    after?: string;
}

export interface GetSinglePostVariables {
    id: string;
}