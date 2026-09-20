#!/usr/bin/env tsx
import BlogStaticService from "../services/blog/BlogStaticService";
import { applySiteMap } from "./sitemap";

async function run(): Promise<void> {
	const service: BlogStaticService = new BlogStaticService();
	const args: string[] = process.argv.slice(2);
	const isWatch: boolean = args.includes("--watch");
	const watchMsArg: string | undefined = args.find((a) => a.startsWith("--interval="),);

	const intervalMs: number = watchMsArg
		? Number.parseInt(watchMsArg.split("=")[1] ?? "60000", 10)
		: 60000;

	if (isWatch) {
		const interval: number = Number.isNaN(intervalMs) ? 60000 : intervalMs;
		console.info(
			`Starting BlogStaticService watch (interval ${interval}ms) with sitemap sync...`,
		);

		// Custom watch loop so sitemap stays in sync without full webpack build
		const tick = async (): Promise<void> => {
			try {
				await service.generate();
				await applySiteMap();
			} catch (error: unknown) {
				console.error("Watch tick failed:", error);
			}
		};

		await tick();
		setInterval(tick, interval);
		return;
	}

	try {
		const result: Awaited<ReturnType<typeof service.generate>> = await service.generate();
		console.info(`Blog generation complete: ${result.manifest.count} posts`);

		// Lightweight blog+sitemap build without full webpack - keeps sitemap in sync
		try {
			await applySiteMap();
		} catch (error: unknown) {
			console.warn("Sitemap refresh after blog generation failed:", error);
		}
	} catch (error: unknown) {
		console.error("Blog generation failed:", error);
		process.exitCode = 1;
	}
}

run();