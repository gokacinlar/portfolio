class HashNodePosts {
    constructor() {
        this.fetchUserPosts(HashNodePosts.USER_NAME, HashNodePosts.DEF_MAX_ARTICLE_LENGTH);
    }

    private static readonly USER_NAME: string = "gokacinlar";
    private static readonly API_ADDRESS: string = "https://api.hashnode.com/";
    private static readonly DEF_MAX_ARTICLE_LENGTH: number = 10;

    private async graphQlFetch(query: string, variables = {}) {
        const data = await fetch(HashNodePosts.API_ADDRESS, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${import.meta.env.HASHNODE_TOKEN}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });

        return data.json();
    }

    // GRAPHQL Query to fetch HashNode posts from my timeline
    public async fetchUserPosts(username: string, first: number = HashNodePosts.DEF_MAX_ARTICLE_LENGTH) {
        const query = `
            query GetUserPosts($username: String!, $first: Int!) {
                user(username: $username) {
                    publication {
                        posts(first: $first) {
                            edges {
                                node {
                                    id
                                    title
                                    brief
                                    slug
                                    publishedAt
                                    coverImage {
                                        url
                                    }
                                    author {
                                        name
                                        username
                                    }
                                }
                            }
                        }
                    }
                }
            }
        `;

        const variables = {
            username: username,
            first: first
        };

        try {
            const result = await this.graphQlFetch(query, variables);

            if (result) {
                return result.data.user.publication.posts.edges.map((edge: any) => {
                    console.log(edge.node);
                });
            } else {
                console.error("Error fetching Hashnode posts.");
            }
        } catch (error: unknown) {
            throw new Error("Error fetching Hashnode posts." + error);
        }
    }
}

export default HashNodePosts;
