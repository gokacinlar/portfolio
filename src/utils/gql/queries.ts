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
                date
                slug
                categories {
                    nodes {
                            name
                            slug
                    }
                }
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
                date
                slug
                categories {
                    nodes {
                            name
                            slug
                    }
                }
                content(format: RENDERED)
                author {
                    node {
                        name
                    }
                }
            }
        }
    `;

    protected static readonly GRAPHQL_QUERY_FETCH_ALL_POSTS: string = `
		query GetAllPosts($first: Int, $after: String) {
			posts(first: $first, after: $after, where: {orderby: {field: DATE, order: DESC}}) {
				pageInfo {
					hasNextPage
					endCursor
				}
				nodes {
					id
					databaseId
					title
					date
					slug
					content(format: RENDERED)
					categories {
						nodes {
							name
							slug
						}
					}
					author {
						node {
							name
						}
					}
				}
			}
		}
	`;
}

export default GraphQLQueries;