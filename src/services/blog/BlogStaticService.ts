import fs from "node:fs";
import path from "node:path";
import type * as gql from "../../ts/interfaces/i.global";
import GraphQLQueries from "../../utils/gql/queries";
import BlogFileWriter from "./BlogFileWriter";
import BlogNodePreserver from "./BlogNodePreserver";
import type {
	BlogDiff,
	BlogGenerationResult,
	BlogManifest,
	StaticPost,
} from "./blogTypes";

class BlogStaticService extends GraphQLQueries {
	private static readonly ENDPOINT: string =
		process.env.WP_GRAPHQL_ENDPOINT ||
		"https://dervisoksuzoglu.xyz/wpb/graphql";

	private readonly writer: BlogFileWriter;

	constructor(writer?: BlogFileWriter) {
		super();
		this.writer = writer ?? new BlogFileWriter();
	}

	private static async executeQuery<TData, TVariables = Record<string, unknown>,>(
		query: string,
		variables?: TVariables,
	): Promise<gql.GraphQLResponse<TData>> {
		const endpoint: string = BlogStaticService.ENDPOINT;
		const response: Response = await fetch(endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({
				query,
				variables,
			}),
		});

		if (!response.ok) {
			throw new Error(
				`HTTP error! status: ${response.status} ${response.statusText} at ${endpoint}`,
			);
		}

		const result: gql.GraphQLResponse<TData> =
			(await response.json()) as gql.GraphQLResponse<TData>;

		if (result.errors && result.errors.length > 0) {
			throw new Error(
				`GraphQL Error: ${result.errors.map((e) => e.message).join(", ")}`,
			);
		}

		return result;
	}

	public async fetchAllNodes(): Promise<gql.GraphQLPostNode[]> {
		type AllPostsData = {
			posts: {
				pageInfo: {
					hasNextPage: boolean;
					endCursor: string | null;
				};
				nodes: gql.GraphQLPostNode[];
			};
		};

		const all: gql.GraphQLPostNode[] = [];
		let after: string | undefined;
		const first: number = 100;

		while (true) {
			const variables: gql.GetPostsVariables = after
				? { first, after }
				: { first };

			const result: gql.GraphQLResponse<AllPostsData> =
				await BlogStaticService.executeQuery<
					AllPostsData,
					gql.GetPostsVariables
				>(BlogStaticService.GRAPHQL_QUERY_FETCH_ALL_POSTS, variables);

			const nodes: gql.GraphQLPostNode[] = result.data.posts.nodes ?? [];
			const pageInfo: { hasNextPage: boolean; endCursor: string | null } =
				result.data.posts.pageInfo;

			for (const node of nodes) {
				all.push(node);
			}

			if (!pageInfo.hasNextPage || !pageInfo.endCursor) {
				break;
			}

			after = pageInfo.endCursor;
		}

		return all;
	}

	public static diffManifest(
		prev: BlogManifest | null,
		nextPosts: StaticPost[],
	): BlogDiff {
		if (!prev) {
			return {
				added: nextPosts,
				updated: [],
				removed: [],
				unchanged: [],
			};
		}

		const prevMap: Map<string, StaticPost> = new Map(
			prev.posts.map((p) => [p.id, p]),
		);
		const nextMap: Map<string, StaticPost> = new Map(
			nextPosts.map((p) => [p.id, p]),
		);

		const added: StaticPost[] = [];
		const updated: StaticPost[] = [];
		const unchanged: StaticPost[] = [];

		for (const post of nextPosts) {
			const prevPost: StaticPost | undefined = prevMap.get(post.id);

			if (!prevPost) {
				added.push(post);
				continue;
			}

			if (prevPost.hash !== post.hash || prevPost.slug !== post.slug) {
				updated.push(post);
				continue;
			}

			unchanged.push(post);
		}

		const removed: StaticPost[] = [];

		for (const post of prev.posts) {
			if (!nextMap.has(post.id)) {
				removed.push(post);
			}
		}

		return { added, updated, removed, unchanged };
	}

	public async generate(): Promise<BlogGenerationResult> {
		this.writer.checkDirectoryExists();

		const prev: BlogManifest | null = this.writer.readPreviousManifest();
		let nodes: gql.GraphQLPostNode[];

		try {
			nodes = await this.fetchAllNodes();
		} catch (error: unknown) {
			console.error(`Failed to fetch WordPress posts: ${error}`);

			if (prev) {
				console.warn(
					"Using previous manifest due to fetch failure - build will not fail",
				);

				return {
					manifest: prev,
					diff: BlogStaticService.diffManifest(prev, prev.posts),
					writtenFiles: [],
				};
			}

			// No previous manifest, create empty
			nodes = [];
		}

		// Preserve every bit of GraphQLPostNode - no narrowing, no runtime fallback truncation
		let posts: StaticPost[];

		try {
			posts = BlogNodePreserver.preserveAll(nodes);
		} catch (error: unknown) {
			throw new Error(`Failed to preserve GraphQL nodes: ${error}`);
		}

		// Deterministic sort by date desc then slug
		posts.sort((a, b) => {
			const da: number = Date.parse(a.date);
			const db: number = Date.parse(b.date);

			if (!Number.isNaN(db) && !Number.isNaN(da) && db !== da) {
				return db - da;
			}

			return a.slug.localeCompare(b.slug);
		});

		const diff: BlogDiff = BlogStaticService.diffManifest(prev, posts);

		const manifest: BlogManifest = {
			generatedAt: new Date().toISOString(),
			endpoint: BlogStaticService.ENDPOINT,
			count: posts.length,
			posts,
		};

		const written: string[] = [];

		try {
			const manifestFiles: string[] = this.writer.writeManifest(manifest);
			written.push(...manifestFiles);
		} catch (error: unknown) {
			throw new Error(`Failed to write manifest: ${error}`);
		}

		// Write per-post static HTML for added/updated only - incremental
		const toWrite: StaticPost[] = [...diff.added, ...diff.updated];

		try {
			if (toWrite.length > 0) {
				const htmlFiles: string[] = this.writer.writePerPostHtml(toWrite);
				written.push(...htmlFiles);
			} else if (!prev) {
				// First run, ensure all have html
				const htmlFiles: string[] = this.writer.writePerPostHtml(posts);
				written.push(...htmlFiles);
			}
		} catch (error: unknown) {
			throw new Error(`Failed to write per-post HTML: ${error}`);
		}

		try {
			if (diff.removed.length > 0) {
				const pruned: string[] = this.writer.pruneRemoved(diff.removed);
				written.push(...pruned.map((p) => `pruned:${p}`));
			}
		} catch (error: unknown) {
			console.error("Failed to prune removed posts:", error);
		}

		// If no diff but per-post HTML missing (clean or manual delete), ensure all html exists
		if (
			diff.added.length === 0 &&
			diff.updated.length === 0 &&
			diff.removed.length === 0 &&
			prev &&
			posts.length > 0
		) {
			const missing: StaticPost[] = [];

			for (const post of posts) {
				const htmlPath: string = path.resolve(
					this.writer.getBlogPublicDir(),
					post.slug,
					"index.html",
				);

				try {
					if (!fs.existsSync(htmlPath)) {
						missing.push(post);
					}
				} catch {
					missing.push(post);
				}
			}

			if (missing.length > 0) {
				try {
					const htmlFiles: string[] =
						this.writer.writePerPostHtml(missing);
					written.push(...htmlFiles);
				} catch {
					// ignore
				}
			}
		}

		console.info(
			`BlogStaticService: generated ${posts.length} posts (added:${diff.added.length} updated:${diff.updated.length} removed:${diff.removed.length})`,
		);

		return {
			manifest,
			diff,
			writtenFiles: written,
		};
	}

	public async watch(intervalMs: number = 60000): Promise<() => void> {
		let timer: ReturnType<typeof setInterval> | null = null;
		let running: boolean = false;

		const tick = async (): Promise<void> => {
			if (running) {
				return;
			}

			running = true;

			try {
				await this.generate();
			} catch (error: unknown) {
				console.error("BlogStaticService watch tick failed:", error);
			} finally {
				running = false;
			}
		};

		await tick();
		timer = setInterval(tick, intervalMs);

		return (): void => {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		};
	}
}

export default BlogStaticService;