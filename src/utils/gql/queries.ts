class GraphQLQueries {
    // Query to fetch only post previews (no content for efficient loading & caching)
    protected static readonly GRAPHQL_QUERY_FETCH_POST_PREVIEWS: string = `
    query GetPostPreviews($first: Int, $after: String) {
        posts(first: $first, after: $after) {
            nodes {
                id
                databaseId
                title
                slug
                author {
                    node {
                        name
                    }
                }
            }
        }
    }
    `;

    // Query to fetch single post with full content on demand
    protected static readonly GRAPHQL_QUERY_FETCH_SINGLE_POST: string = `
        query GetSinglePost($id: ID!) {
            post(id: $id, idType: ID) {
                id
                title
                slug
                content(format: RENDERED)
                author {
                    node {
                        name
                    }
                }
            }
        }
    `;

    // Query to fetch single post with "URL"
    protected static readonly GRAPHQL_QUERY_FETCH_POST_BY_SLUG: string = `
        query GetPostBySlug($slug: String!) {
            postBy(slug: $slug) {
                id
                title
                slug
                content(format: RENDERED)
                author {
                    node {
                        name
                    }
                }
            }
        }
    `;

}

export default GraphQLQueries;