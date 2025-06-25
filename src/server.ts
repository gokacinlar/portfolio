import express from "express";
import path from "path";

// Initialize the server
const app = express();
const PORT = process.env.PORT || 4321;

// Serve the static files from public directory
app.use(express.static(path.resolve(__dirname, "../public")));

// Actual SSR rendering
function renderRoot(): string {
    return `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8" />
                <title>SSR App</title>
                <link rel="stylesheet" href="/main.css" />
            </head>
            <body>
                <div id="app">
                    <h1>Hello from SSR!</h1>
                    <p>This HTML was rendered on the server.</p>
                </div>
                <script src="/bundle.js"></script>
            </body>
        </html>
    `;
}

// Handle GET requests
app.get("*", (_req, res) => {
    const html = renderRoot();
    res.status(200).send(html);
});

app.listen(PORT, () => {
    console.log(`Server is now listening to port ${PORT}`);
})