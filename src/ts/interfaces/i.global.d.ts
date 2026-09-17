export interface HeroConfig {
    name: string,
    className: string,
    link: string,
    imageSrc: string,
    srcSet: string
}

export interface SkillConfig {
    imageOne: string
    imageTwo: string
    title: string
}

export interface ShuffleElement {
    selector: string,
    multiple: boolean
}

export interface SocialsElement {
    name: string,
    icon: string,
    href: URL;
}

export interface WebHapticPatterns {
    success: [{ duration: 50 }, { delay: 50, duration: 50 }]
    nudge: [{ duration: 80, intensity: 0.8 }, { delay: 80, duration: 50, intensity: 0.3 }]
    error: [{ duration: 50, intensity: 0.75 }]
    buzz: [{ duration: 1000, intensity: 1 }]
}

export interface HTMXOptions {
    hxget: string;
    hxtrigger: "click" | "change" | "mouseover";
    hxswap: "innerHTML transition:true" | "outerHTML" | "beforebegin" | "afterbegin" | "beforeend" | "afterend";
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
    categories: Category[];
}

export interface PostPreviewSingle {
    id: string;
    title: string;
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

export interface GraphQLPreviewPostNode {
    id: string;
    title: string;
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

// Query variable type
export interface GetPostsVariables {
    first?: number;
    after?: string;
}

export interface GetSinglePostVariables {
    id: string;
}

// Work

export type WorkActionType = "Contact" | "udemy" | "enroll" | "external" | "github" | "whatsapp" | "custom";

export interface WorkButtonConfig {
    label: string
    url: string
    actionType?: WorkActionType
    icon?: string
}

export interface EnglishWorkBuyingOptions {
    courseName: string
    courseLabel: string
    courseDescription: string
    courseUrl: string
    coursePromoImageUrl: string
    coursePrice: number
    courseActionType?: WorkActionType
    courseButtonLabel?: string
    courseButtonIcon?: string
    // Optional extra buttons (e.g. WhatsApp) rendered alongside primary CTA
    courseExtraButtons?: WorkButtonConfig[]
}

export interface FeaturedPlanConfig {
    tier: "free" | "pro" | "max" | string
    tierLabel: string
    subtitle: string
    price: number
    pricePeriod?: string
    badge?: string
    highlighted?: boolean
    features: string[]
    // Optional excluded features shown as muted
    excludedFeatures?: string[]
    button: WorkButtonConfig
    secondaryButton?: WorkButtonConfig
    accent?: string
}