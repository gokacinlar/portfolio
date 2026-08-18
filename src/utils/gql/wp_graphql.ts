import type * as type from "../../ts/interfaces/i.global";
import GraphQLQueries from "./queries";

class WordPressGraphQLClient extends GraphQLQueries {
    private static readonly BASE_DOMAIN: string = "https://dervisoksuzoglu.xyz";
    private static readonly GRAPHQL_ENDPOINT: string = "https://dervisoksuzoglu.xyz/wpb/graphql";

    private static async executeQuery<TData, TVariables = Record<string, unknown>>(query: string, variables?: TVariables): Promise<type.GraphQLResponse<TData>> {
        const response = await fetch(this.GRAPHQL_ENDPOINT, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                query,
                variables,
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const result: type.GraphQLResponse<TData> = await response.json();

            // Handle GraphQL errors
            if (result.errors && result.errors.length > 0) {
                throw new Error(
                    `GraphQL Error: ${result.errors.map(e => e.message).join(", ")}`
                );
            } else {
                return result;
            }
        }
    }

    // Transform GraphQL data to readable as a readable JSON output (partial)
    private static transformPostPreview(node: type.GraphQLPostNode): type.PostPreview {
        return {
            id: node.id || "Unknown ID",
            title: node.title || "Unknown Title",
            author: {
                name: node.author.node.name || "Unknown Author",
            }
        };
    }


    // Transform GraphQL data to full Post
    private static transformPostNode(node: type.GraphQLPostNode): type.Post {
        const postUrl = this.generatePostUrl(node.slug); // Add URL for each post
        if (!node) {
            throw new Error(`<b>Post not found.</b>`);
        } else {
            return {
                id: node.id,
                title: node.title || "Unknown Title",
                content: node.content || "<p>No proper content.</p>",
                author: {
                    name: node.author.node.name || "Unknown Author",
                },
                url: postUrl
            };
        }
    }

    private static readonly DEF_BLOG_POST_NUMBER_TO_BE_FETCHED: number = 10;
    private static readonly CACHE_KEY_PREVIEW: string = "wordpress_blog_post_previews";
    private static readonly CACHE_KEY_POST_PREFIX: string = "wordpress_blog_post_";
    private static readonly CACHE_EXPIRATION_HOURS: number = 24; // Valid for 1 day

    // Fetch post previews (titles and authors only)
    public static async fetchBlogPostPreviews(variables: type.GetPostsVariables = { first: WordPressGraphQLClient.DEF_BLOG_POST_NUMBER_TO_BE_FETCHED }): Promise<type.PostPreview[]> {
        const cachedData = this.getCachedPreviews();
        if (cachedData && cachedData.length > 0) {
            return cachedData;
        }

        try {
            const response = await this.executeQuery<type.GraphQLPostsData, type.GetPostsVariables>(
                this.GRAPHQL_QUERY_FETCH_POST_PREVIEWS,
                variables
            );

            const transformedPreviews = response.data.posts.nodes.map(this.transformPostPreview);
            this.cachePreviews(transformedPreviews);

            return transformedPreviews;
        } catch (error: unknown) {
            throw new Error("Error fetching WordPress post previews: " + error);
        }
    }

    // Fetch single post with full content
    public static async fetchSinglePost(postId: string): Promise<type.Post> {
        // Check if this specific post is cached
        const cachedPost = this.getCachedPost(postId);
        if (cachedPost) {
            return cachedPost;
        }

        try {
            const response = await this.executeQuery<type.GraphQLSinglePostData, type.GetSinglePostVariables>(
                this.GRAPHQL_QUERY_FETCH_SINGLE_POST, { id: postId, });

            if (!response.data.post) {
                throw new Error("No post found with the given ID");
            }

            const transformedPost = this.transformPostNode(response.data.post);
            this.cachePost(transformedPost);

            return transformedPost;
        } catch (error: unknown) {
            throw new Error("Error fetching WordPress post: " + error);
        }
    }

    // Get post via URL a.k.a slug
    public static async fetchPostBySlug(slug: string): Promise<type.Post> {
        const cachedPost = this.getCachedPostBySlug(slug);
        if (cachedPost) {
            return cachedPost;
        } else {
            try {
                const response = await this.executeQuery<{ postBy: type.GraphQLPostNode }, { slug: string }>(
                    this.GRAPHQL_QUERY_FETCH_POST_BY_SLUG,
                    { slug }
                );

                if (!response.data.postBy) {
                    throw new Error("No post found with the given slug");
                }

                const transformedPost = this.transformPostNode(response.data.postBy);
                this.cachePost(transformedPost);

                return transformedPost;
            } catch (error: unknown) {
                throw new Error("Error fetching WordPress post by slug: " + error);
            }
        }
    }

    private static getCachedPreviews(): type.PostPreview[] {
        try {
            const cachedItem = localStorage.getItem(WordPressGraphQLClient.CACHE_KEY_PREVIEW);

            if (!cachedItem) {
                return [];
            }

            const parsedCache = JSON.parse(cachedItem);
            const currentTime = new Date().getTime();
            const cacheAge: number = (currentTime - parsedCache.timestamp) / (1000 * 60 * 60);

            if (cacheAge < this.CACHE_EXPIRATION_HOURS) {
                return parsedCache.previews;
            }

            localStorage.removeItem(WordPressGraphQLClient.CACHE_KEY_PREVIEW);
            return [];
        } catch (error: unknown) {
            console.error("Error retrieving cached previews:", error);
            return [];
        }
    }

    private static cachePreviews(previews: type.PostPreview[]): void {
        try {
            const cacheItem = {
                timestamp: new Date().getTime(),
                previews: previews
            };
            localStorage.setItem(WordPressGraphQLClient.CACHE_KEY_PREVIEW, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Error caching previews in localStorage:', error);
        }
    }

    private static getCachedPost(postId: string): type.Post | null {
        try {
            const cacheKey = this.CACHE_KEY_POST_PREFIX + postId;
            const cachedItem = localStorage.getItem(cacheKey);

            if (!cachedItem) {
                return null;
            }

            const parsedCache = JSON.parse(cachedItem);
            const currentTime = new Date().getTime();
            const cacheAge: number = (currentTime - parsedCache.timestamp) / (1000 * 60 * 60);

            if (cacheAge < this.CACHE_EXPIRATION_HOURS) {
                return parsedCache.post;
            }

            localStorage.removeItem(cacheKey);
            return null;
        } catch (error: unknown) {
            console.error("Error retrieving cached post:", error);
            return null;
        }
    }

    // Get cached posts via URL if they exist
    private static getCachedPostBySlug(slug: string): type.Post | null {
        try {
            const cacheKey: string = `${this.CACHE_KEY_POST_PREFIX}slug_${slug}`;
            const cachedItem = localStorage.getItem(cacheKey);

            if (!cachedItem) {
                return null;
            }

            const parsedCache = JSON.parse(cachedItem);
            const currentTime = new Date().getTime();
            const cacheAge: number = (currentTime - parsedCache.timestamp) / (1000 * 60 * 60);

            if (cacheAge < this.CACHE_EXPIRATION_HOURS) {
                return parsedCache.post;
            }

            localStorage.removeItem(cacheKey);
            return null;
        } catch (error: unknown) {
            console.error("Error retrieving cached post by slug:", error);
            return null;
        }
    }

    private static cachePost(post: type.Post): void {
        try {
            const cacheKey = this.CACHE_KEY_POST_PREFIX + post.id;
            const cacheItem = {
                timestamp: new Date().getTime(),
                post: post
            };
            localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Error caching post in localStorage:', error);
        }
    }

    // Generate post URL from slug via wordpress graphql query
    private static generatePostUrl(slug: string): string {
        const newDomain: string = WordPressGraphQLClient.BASE_DOMAIN;
        if (!newDomain) {
            throw new Error(`Unable to localte ${newDomain}`);
        } else {
            return `${newDomain}/${slug}`;
        }
    }
}

export default WordPressGraphQLClient;