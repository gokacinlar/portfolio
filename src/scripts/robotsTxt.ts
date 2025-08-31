#!/usr/bin/env tsx
import fs from "fs";
import path from "path";
import robotstxt from "generate-robotstxt";

interface CrawlPolicy {
    userAgent: string;
    allow: string | string[];
    disallow: string | string[];
    crawlDelay: number;
    cleanParam?: string;
}

class GenerateRobotsTXT {
    private static readonly SITE_NAME: string = "https://dervisoksuzoglu.com.tr";
    private static readonly POLICY: CrawlPolicy[] = [
        {
            userAgent: "Googlebot",
            allow: "/",
            disallow: "/search",
            crawlDelay: 2,
        },
        {
            userAgent: "OtherBot",
            allow: ["/allow-for-all-bots", "/allow-only-for-other-bot"],
            disallow: ["/admin", "/login"],
            crawlDelay: 2,
        },
        {
            userAgent: "*",
            allow: "/",
            disallow: "/search",
            crawlDelay: 10,
            cleanParam: "ref /articles/",
        },
    ];

    public async initRobotsGeneration(): Promise<string> {
        try {
            const content = await robotstxt({
                policy: GenerateRobotsTXT.POLICY,
                sitemap: `${GenerateRobotsTXT.SITE_NAME}/sitemap.xml`,
                host: GenerateRobotsTXT.SITE_NAME
            });
            return content;
        } catch (error: unknown) {
            throw new Error(`Unable to create robots.txt: ${error}`);
        }
    }

    public async saveOutput(): Promise<void> {
        const outputPath = path.resolve(__dirname, "../../public/robots.txt");

        try {
            // Generate robots.txt content
            const content = await this.initRobotsGeneration();
            fs.writeFileSync(outputPath, content);

            console.log("ROBOTS.TXT has been successfully generated into: ", outputPath);
        } catch (error: unknown) {
            console.error("Failed to generate robots.txt:", error);
        }
    }
}

const generator = new GenerateRobotsTXT();
generator.saveOutput();