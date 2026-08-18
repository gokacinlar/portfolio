#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import { SitemapStream, streamToPromise } from "sitemap";

const siteName: URL = new URL("https://dervisoksuzoglu.xyz");

async function applySiteMap() {
    // Create empty XML file to be manipulated
    const outputPath = path.resolve(__dirname, "../../public/sitemap.xml");
    const sitemap = new SitemapStream({
        hostname: siteName.toString()
    });

    // Define URLs to be crawled to be represented in XML format
    // These should locate the domain url, not the files in the project
    const urls: Array<Object> = [
        { url: "/index.html", changefreq: "daily", priority: 1.0 },
        { url: "/work.html", changefreq: "daily", priority: 0.9 },
        { url: "/about.html", changefreq: "monthly", priority: 0.9 },
        { url: "/updates.html", changefreq: "daily", priority: 0.8 }
    ];

    urls.forEach((url: Object) => {
        sitemap.write(url)
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

applySiteMap();