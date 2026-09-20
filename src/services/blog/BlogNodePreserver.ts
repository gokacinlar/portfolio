import { createHash } from "node:crypto";
import type * as gql from "../../ts/interfaces/i.global";
import type { StaticPost } from "./blogTypes";

// Store our blog posts from the WP GraphQL Backend to later populate the /blog
class BlogNodePreserver {
	private static readonly BASE_DOMAIN: string = "https://dervisoksuzoglu.xyz";

	public static hashContent(input: string): string {
		return createHash("sha256")
			.update(input, "utf8")
			.digest("hex")
			.slice(0, 16);
	}

	public static generatePostUrl(slug: string): string {
		if (!slug) {
			throw new Error(`Unable to generate URL for empty slug`);
		}

		return `${BlogNodePreserver.BASE_DOMAIN}/blog/${slug}`;
	}

	public static preserve(node: gql.GraphQLPostNode): StaticPost {
		if (!node) {
			throw new Error(`GraphQLPostNode is null or undefined`);
		}

		if (!node.id || !node.slug) {
			throw new Error(`GraphQLPostNode missing required fields: id/slug`);
		}

		const title: string = node.title || "Unknown Title";
		const date: string = node.date || "Date Unknown";
		const content: string = node.content || "<p>No proper content.</p>";
		const categories: gql.Category[] = node.categories?.nodes ?? [];
		const author: gql.Author = {
			name: node.author?.node?.name || "Unknown Author",
		};
		const url: string = BlogNodePreserver.generatePostUrl(node.slug);
		const hashSeed: string = `${node.id}|${node.slug}|${content}|${date}`;
		const hash: string = BlogNodePreserver.hashContent(hashSeed);

		return {
			raw: node,
			id: node.id,
			slug: node.slug,
			title,
			date,
			content,
			author,
			categories,
			url,
			hash,
			generatedAt: new Date().toISOString(),
		};
	}

	public static preserveAll(nodes: gql.GraphQLPostNode[]): StaticPost[] {
		return nodes.map((node) => BlogNodePreserver.preserve(node));
	}
}

export default BlogNodePreserver;