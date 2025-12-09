// GraphQL-related interface entries

interface GraphQLAuthorNode {
    name: string;
}

interface GraphQLAuthor {
    node: GraphQLAuthorNode;
}

interface GraphQLPostNode {
    id: string;
    title: string;
    author: GraphQLAuthor;
    content: string;
}

interface GraphQLPostsConnection {
    nodes: GraphQLPostNode[];
}

interface GraphQLPostsData {
    posts: GraphQLPostsConnection;
}

// Single post query response
interface GraphQLSinglePostData {
    post: GraphQLPostNode;
}

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}

// Domain types we'll convert from queries
interface Author {
    name: string;
}

interface Post {
    id: string;
    title: string;
    author: Author;
    content: string;
}

// Lightweight post for initial listing
interface PostPreview {
    id: string;
    title: string;
    author: Author;
}

// Query variable type
interface GetPostsVariables {
    first?: number;
    after?: string;
}

interface GetSinglePostVariables {
    id: string;
}

export type {
    WordPressGraphQLClient,
    Post,
    PostPreview,
    Author,
    GetPostsVariables,
    GetSinglePostVariables
};

class WordPressGraphQLClient {
    private static readonly GRAPHQL_ENDPOINT = "https://dervisoksuzoglu.com.tr/wp_blog/graphql";

    // Query to fetch only post previews (no content for efficient loading & caching)
    private static readonly GRAPHQL_QUERY_FETCH_POST_PREVIEWS = `
    query GetPostPreviews($first: Int, $after: String) {
        posts(first: $first, after: $after) {
            nodes {
                id
                databaseId
                title
                author {
                    node {
                        name
                    }
                }
            }
        }
    }
    ` as const;

    // Query to fetch single post with full content on demand
    private static readonly GRAPHQL_QUERY_FETCH_SINGLE_POST = `
        query GetSinglePost($id: ID!) {
            post(id: $id, idType: ID) {
                id
                title
                content(format: RENDERED)
                author {
                    node {
                        name
                    }
                }
            }
        }
    ` as const;

    private static async executeQuery<TData, TVariables = Record<string, unknown>>(query: string, variables?: TVariables): Promise<GraphQLResponse<TData>> {
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
            const result: GraphQLResponse<TData> = await response.json();

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
    private static transformPostPreview(node: GraphQLPostNode): PostPreview {
        return {
            id: node.id || "Unknown ID",
            title: node.title || "Unknown Title",
            author: {
                name: node.author.node.name || "Unknown Author",
            },
        };
    }

    // Transform GraphQL data to full Post
    private static transformPostNode(node: GraphQLPostNode): Post {
        if (!node) {
            throw new Error(`<b>Post not found </b>`);
        } else {
            return {
                id: node.id,
                title: node.title || "Unknown Title",
                content: node.content || "<p>No proper content.</p>",
                author: {
                    name: node.author.node.name || "Unknown Author",
                },
            };
        }
    }

    private static readonly DEF_BLOG_POST_NUMBER_TO_BE_FETCHED: number = 10;
    private static readonly CACHE_KEY_PREVIEWS = "wordpress_blog_post_previews";
    private static readonly CACHE_KEY_POST_PREFIX = "wordpress_blog_post_";
    private static readonly CACHE_EXPIRATION_HOURS = 24; // Valid for 1 day

    // Fetch post previews (titles and authors only)
    public static async fetchBlogPostPreviews(variables: GetPostsVariables = { first: WordPressGraphQLClient.DEF_BLOG_POST_NUMBER_TO_BE_FETCHED }): Promise<PostPreview[]> {
        const cachedData = this.getCachedPreviews();
        if (cachedData && cachedData.length > 0) {
            return cachedData;
        }

        try {
            const response = await this.executeQuery<GraphQLPostsData, GetPostsVariables>(
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
    public static async fetchSinglePost(postId: string): Promise<Post> {
        // Check if this specific post is cached
        const cachedPost = this.getCachedPost(postId);
        if (cachedPost) {
            return cachedPost;
        }

        try {
            const response = await this.executeQuery<GraphQLSinglePostData, GetSinglePostVariables>(
                this.GRAPHQL_QUERY_FETCH_SINGLE_POST,
                { id: postId }
            );

            // For external debuggining purposes
            // console.log('Full GraphQL Response:', JSON.stringify(response, null, 2));

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

    private static getCachedPreviews(): PostPreview[] {
        try {
            const cachedItem = localStorage.getItem(this.CACHE_KEY_PREVIEWS);

            if (!cachedItem) {
                return [];
            }

            const parsedCache = JSON.parse(cachedItem);
            const currentTime = new Date().getTime();
            const cacheAge: number = (currentTime - parsedCache.timestamp) / (1000 * 60 * 60);

            if (cacheAge < this.CACHE_EXPIRATION_HOURS) {
                return parsedCache.previews;
            }

            localStorage.removeItem(this.CACHE_KEY_PREVIEWS);
            return [];
        } catch (error: unknown) {
            console.error("Error retrieving cached previews:", error);
            return [];
        }
    }

    private static cachePreviews(previews: PostPreview[]): void {
        try {
            const cacheItem = {
                timestamp: new Date().getTime(),
                previews: previews
            };
            localStorage.setItem(this.CACHE_KEY_PREVIEWS, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Error caching previews in localStorage:', error);
        }
    }

    private static getCachedPost(postId: string): Post | null {
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

    private static cachePost(post: Post): void {
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
}

export default WordPressGraphQLClient;