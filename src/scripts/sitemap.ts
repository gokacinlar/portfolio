#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";

const siteName: URL = new URL("https://dervisoksuzoglu.xyz");

export async function applySiteMap() {
	// Create empty XML file to be manipulated
	const outputPath = path.resolve(__dirname, "../../public/sitemap.xml");
	const sitemap = new SitemapStream({
		hostname: siteName.toString(),
	});

	// Define URLs to be crawled to be represented in XML format
	// These should locate the domain url, not the files in the project
	const urls: Array<Object> = [
		{ url: "/index.html", changefreq: "daily", priority: 1.0 },
		{ url: "/work.html", changefreq: "daily", priority: 0.9 },
		{ url: "/about.html", changefreq: "monthly", priority: 0.9 },
		{ url: "/updates.html", changefreq: "daily", priority: 0.8 },
	];

	// Enrich with statically generated blog posts - preserves every GraphQLPostNode as static URL
	try {
		const manifestPaths: string[] = [
			path.resolve(
				__dirname,
				"../../public/assets/json/generated/blog-manifest.json",
			),
			path.resolve(
				__dirname,
				"../../src/assets/json/generated/blog-manifest.json",
			),
		];

		for (const manifestPath of manifestPaths) {
			if (fs.existsSync(manifestPath)) {
				const raw: string = fs.readFileSync(manifestPath, "utf8");
				const manifest: { posts: Array<{ slug: string; date: string }> } =
					JSON.parse(raw);

				for (const post of manifest.posts) {
					if (post.slug) {
						urls.push({
							url: `/blog/${post.slug}/`,
							changefreq: "weekly",
							priority: 0.7,
							lastmod: post.date,
						});
					}
				}

				break;
			}
		}
	} catch (error: unknown) {
		console.warn("Unable to enrich sitemap with blog posts:", error);
	}

	urls.forEach((url: Object) => {
		sitemap.write(url);
	});

	sitemap.end();

	// Actual buffer manipulation
	try {
		// Convert stream to buffer
		const buffer = await streamToPromise(sitemap);
		const stringifiedBuffer = buffer.toString("utf-8");

		if (!outputPath) {
			console.error(`${outputPath} doesn't exist.`);
			return;
		}

		// Write stringified buffer to file
		fs.writeFileSync(outputPath, stringifiedBuffer);

		console.log("Sitemap has been successfully generated into: ", outputPath);

		return stringifiedBuffer;
	} catch (error: unknown) {
		console.error("Failed to generate sitemap:", error);
	}
}

const isDirectRun: boolean = process.argv[1]?.endsWith("sitemap.ts") ?? false;

if (isDirectRun) {
	applySiteMap();
}

export default applySiteMap;
