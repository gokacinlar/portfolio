import express from "express";
import path from "path";
import fs from "fs";

// Initialize the server
const app = express();
const PORT = process.env.PORT || 4321;

// Serve the static files from public directory
const publicDir = path.resolve(__dirname, "../public");
app.use(express.static(publicDir));

// Handle GET requests
app.get("*", (_req, res) => {
    // Serve the index.html with linked components inside
    const indexPath = path.join(publicDir, "index.html");
    fs.readFile(indexPath, "utf8", (_err, html) => {
        try {
            res.send(html);
        } catch (error: unknown) {
            console.warn(`Error loading index.html: ${error}`);
            return;
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is now listening to port ${PORT}`);
});