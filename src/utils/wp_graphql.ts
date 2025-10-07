// GraphQL-related interface entries
interface GraphQLAvatar {
    url: string;
}

interface GraphQLAuthorNode {
    name: string;
    avatar: GraphQLAvatar;
}

interface GraphQLAuthor {
    node: GraphQLAuthorNode;
}

interface GraphQLPostNode {
    id: string;
    title: string;
    author: GraphQLAuthor;
}

interface GraphQLPostsConnection {
    nodes: GraphQLPostNode[];
}

interface GraphQLPostsData {
    posts: GraphQLPostsConnection;
}

interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}

// Domain types we"ll convert from queries
interface Author {
    name: string;
    avatarUrl: string;
}

interface Post {
    id: string;
    title: string;
    author: Author;
}

// Query variable type
interface GetPostsVariables {
    first?: number;
    after?: string;
}

export type {
    WordPressGraphQLClient,
    Post,
    Author,
    GetPostsVariables
};

class WordPressGraphQLClient {
    private static readonly GRAPHQL_ENDPOINT = "http://localhost:10005/graphql";
    private static readonly GRAPHQL_QUERY_TO_FETCH_BLOG_POSTS = `
    query GetPosts($first: Int, $after: String) {
        posts(first: $first, after: $after) {
            nodes {
                id
                title
                author {
                    node {
                        name
                        avatar {
                            url
                        }
                    }
                }
            }
        }
    }
    ` as const;

    private static async executeQuery<TData, TVariables = Record<string, unknown>>(query: string, variables?: TVariables): Promise<GraphQLResponse<TData>> {
        const response = await fetch(this.GRAPHQL_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
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

    private static transformPostNode(node: GraphQLPostNode): Post {
        return {
            id: node.id,
            title: node.title,
            author: {
                name: node.author.node.name,
                avatarUrl: node.author.node.avatar.url,
            },
        };
    }

    private static readonly DEF_BLOG_POST_NUMBER_TO_BE_FETCHED: number = 10;
    private static readonly CACHE_KEY = "wordpress_blog_posts";
    private static readonly CACHE_EXPIRATION_HOURS = 24; // Valid for 1 day
    // Actual blog post fetching
    public static async fetchBlogPosts(variables: GetPostsVariables = { first: WordPressGraphQLClient.DEF_BLOG_POST_NUMBER_TO_BE_FETCHED }): Promise<Post[]> {
        const cachedData = this.getCachedData();

        if (cachedData) {
            return cachedData;
        } else {
            try {
                // Actual data fetching happens here
                const response = await this.executeQuery<GraphQLPostsData, GetPostsVariables>(
                    this.GRAPHQL_QUERY_TO_FETCH_BLOG_POSTS,
                    variables
                );

                // Caching process
                const transformedPosts = response.data.posts.nodes.map(this.transformPostNode);
                this.cachePosts(transformedPosts);

                return transformedPosts;
            } catch (error: unknown) {
                throw new Error("Error fetching WordPress posts:" + error);
            }
        }
    }

    private static getCachedData(): Post[] {
        try {
            const cachedItem = localStorage.getItem(this.CACHE_KEY);

            if (!cachedItem) {
                return [];
            }

            const parsedCache = JSON.parse(cachedItem);
            const currentTime = new Date().getTime();
            const cacheAge: number = (currentTime - parsedCache.timestamp) / (1000 * 60 * 60); // Convert to hours

            // Check if cache is still valid
            if (cacheAge < this.CACHE_EXPIRATION_HOURS) {
                return parsedCache.posts;
            }

            // Remove expired cache
            localStorage.removeItem(this.CACHE_KEY);
            return [];
        } catch (error: unknown) {
            console.error("Error retrieving cached posts:", error);
            return [];
        }
    }

    private static cachePosts(posts: Post[]): void {
        try {
            const cacheItem = {
                timestamp: new Date().getTime(),
                posts: posts
            };
            localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheItem));
        } catch (error) {
            console.error('Error caching posts in localStorage:', error);
        }
    }
}

export default WordPressGraphQLClient;

// Incremental post fetching for pagination
// For later use
async function fetchCustomAmount(): Promise<void> {
    try {
        // Fetch with custom variables
        const posts = await WordPressGraphQLClient.fetchBlogPosts({ first: 20 });
        console.log(`Fetched ${posts.length} posts`);
    } catch (error) {
        console.error("Failed to fetch posts:", error);
    }
}