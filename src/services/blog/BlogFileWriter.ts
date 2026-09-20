import fs from "node:fs";
import path from "node:path";
import type { BlogManifest, StaticPost } from "./blogTypes";

class BlogFileWriter {
	private readonly generatedDir: string;
	private readonly publicDir: string;
	private readonly blogPublicDir: string;

	constructor(generatedDir?: string, publicDir?: string) {
		this.generatedDir = generatedDir ?? path.resolve(__dirname, "../../assets/json/generated");
		this.publicDir = publicDir ?? path.resolve(__dirname, "../../../public");
		this.blogPublicDir = path.resolve(this.publicDir, "blog");
	}

	public checkDirectoryExists(): void {
		try {
			fs.mkdirSync(this.generatedDir, { recursive: true });
			fs.mkdirSync(this.publicDir, { recursive: true });
			fs.mkdirSync(this.blogPublicDir, { recursive: true });
		} catch (error: unknown) {
			throw new Error(`Failed to ensure output directories: ${error}`);
		}
	}

	public atomicWriteFile(targetPath: string, content: string): void {
		const dir: string = path.dirname(targetPath);

		try {
			fs.mkdirSync(dir, { recursive: true });
		} catch (error: unknown) {
			throw new Error(`Failed to create directory ${dir}: ${error}`);
		}

		const tmpPath: string = `${targetPath}.tmp`;

		try {
			fs.writeFileSync(tmpPath, content, "utf8");
			fs.renameSync(tmpPath, targetPath);
		} catch (error: unknown) {
			try {
				if (fs.existsSync(tmpPath)) {
					fs.unlinkSync(tmpPath);
				}
			} catch (error: unknown) {
				throw new Error(`Error while writing content: ${error}`);
			}

			throw new Error(`Failed to write file ${targetPath}: ${error}`);
		}
	}

	public writeManifest(manifest: BlogManifest): string[] {
		this.checkDirectoryExists();

		const written: string[] = [];
		const manifestJson: string = JSON.stringify(manifest, null, "\t");
		const manifestPath: string = path.resolve(
			this.generatedDir,
			"blog-manifest.json",
		);
		const postsPath: string = path.resolve(
			this.generatedDir,
			"blog-posts.json",
		);

		this.atomicWriteFile(manifestPath, manifestJson);
		written.push(manifestPath);

		this.atomicWriteFile(postsPath, manifestJson);
		written.push(postsPath);

		// Also mirror to public for direct serving without webpack copy in dev
		const publicManifestPath: string = path.resolve(
			this.publicDir,
			"assets/json/generated/blog-manifest.json",
		);
		const publicPostsPath: string = path.resolve(
			this.publicDir,
			"assets/json/generated/blog-posts.json",
		);

		try {
			this.atomicWriteFile(publicManifestPath, manifestJson);
			written.push(publicManifestPath);
			this.atomicWriteFile(publicPostsPath, manifestJson);
			written.push(publicPostsPath);
		} catch {
			// public may be cleaned by webpack, non-fatal
		}

		return written;
	}

	public writePerPostHtml(posts: StaticPost[]): string[] {
		this.checkDirectoryExists();

		const written: string[] = [];

		for (const post of posts) {
			const slugDir: string = path.resolve(this.blogPublicDir, post.slug);
			const htmlPath: string = path.resolve(slugDir, "index.html");
			const html: string = this.renderPostHtml(post);

			this.atomicWriteFile(htmlPath, html);
			written.push(htmlPath);
		}

		return written;
	}

	public pruneRemoved(removed: StaticPost[]): string[] {
		const pruned: string[] = [];

		for (const post of removed) {
			const slugDir: string = path.resolve(this.blogPublicDir, post.slug);

			try {
				if (fs.existsSync(slugDir)) {
					fs.rmSync(slugDir, { recursive: true, force: true });
					pruned.push(slugDir);
				}
			} catch (error: unknown) {
				console.error(`Failed to prune ${slugDir}:`, error);
			}
		}

		return pruned;
	}

	public readPreviousManifest(): BlogManifest | null {
		const manifestPath: string = path.resolve(
			this.generatedDir,
			"blog-manifest.json",
		);

		try {
			if (!fs.existsSync(manifestPath)) {
				return null;
			}

			const raw: string = fs.readFileSync(manifestPath, "utf8");
			return JSON.parse(raw) as BlogManifest;
		} catch (error: unknown) {
			console.error("Failed to read previous manifest:", error);
			return null;
		}
	}

	private renderPostHtml(post: StaticPost): string {
		// HTML escape characters
		const esc = (v: string): string =>
			v
				.replaceAll("&", "&amp;")
				.replaceAll("<", "&lt;")
				.replaceAll(">", "&gt;")
				.replaceAll('"', "&quot;");
		const title: string = esc(post.title);
		const author: string = esc(post.author.name);
		const date: string = esc(post.date);

		return /*html*/`
			<!doctype html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1">
				<title>${title} — Derviş Öksüzoğlu</title>
				<meta name="description" content="${title} by ${author}">
				<link rel="canonical" href="${post.url}">
				<meta property="og:title" content="${title}">
				<meta property="og:url" content="${post.url}">
				<meta property="og:type" content="article">
			</head>
			<body>
				<!-- Generated content -->
				<article class="blog-post" data-post-id="${post.id}" data-slug="${post.slug}">
					<header><h1>${title}</h1><p>${author} — ${date}</p></header>
					<div class="blog-post-content">${post.content}</div>
				</article>
			</body>
			</html>
		`;
	}

	public getBlogPublicDir(): string {
		return this.blogPublicDir;
	}
}

export default BlogFileWriter;