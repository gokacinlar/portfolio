#!/usr/bin/env tsx
import * as fs from "node:fs";
import * as path from "node:path";

/**
 * User script to add missing "html" keyword to <!DOCTYPE> attribute
 * to newly created .html files in /public because html-webpack-plugin
 * emits the word "html" from the output files
 */

const PUBLIC_DIR: string = path.resolve(__dirname, "../../public");
const CORRECT_DOCTYPE_STRING: string = "<!DOCTYPE html";

function fixDoctypeInFile(filePath: string): void {
    if (!filePath) {
        console.error("Please provide a file path");
        return;
    }

    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.split("\n");
    const firstLine = lines[0] as string; // Definitely having a doctype keyword there

    // Check if first line is "<!DOCTYPE " (missing "html" keyword) which is
    // produced by htmlwebpackplugin via lodash, emits "html"
    const missingWord = /^<!DOCTYPE\s(?!html)/.test(firstLine);

    if (missingWord) {
        // Replace "<!DOCTYPE " at the start with "<!DOCTYPE html"
        const fixedFirstLine = firstLine.replace(/^<!DOCTYPE\s/, CORRECT_DOCTYPE_STRING);
        const fixedContent = fixedFirstLine + "\n" + lines.slice(1).join("\n"); // add two lines together

        fs.writeFileSync(filePath, fixedContent, "utf-8");
        console.log(`Fixed DOCTYPE in: ${path.relative(PUBLIC_DIR, filePath)}`);
    }
}

// Main execution
let htmlFileCount = 0;
function countAndWalk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            countAndWalk(fullPath);
        } else if (entry.isFile() && entry.name.endsWith(".html")) {
            fixDoctypeInFile(fullPath);
            htmlFileCount++;
        }
    }
}

countAndWalk(PUBLIC_DIR);
console.log(`Fixed all ${htmlFileCount} HTML files in ${PUBLIC_DIR}`);