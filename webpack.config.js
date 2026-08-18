const path = require("path");
const glob = require("glob");
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const WebpackPwaManifest = require("webpack-pwa-manifest");

// CSP configuration for trusted external scripts
const scripts = [
    "https://web3forms.com/client/script.js",
    "https://api.web3forms.com/submit",
    "https://*.googletagmanager.com",
    "https://www.google.com/recaptcha/",
    "https://www.gstatic.com/recaptcha/"
];

const imageConnections = [
    "https://creativecommons.org/publicdomain/zero/1.0/",
    "https://notbyai.fyi/",
    "https://raw.githubusercontent.com",
];

// Meta tags for HTML
const htmlWebpackPluginMeta = {
    description: { name: "description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
    keywords: { name: "keywords", content: "derviş, öksüzoğlu, derviş öksüzoğlu, blog, portfolyo, ingilizce öğretmeni, english teacher, web geliştiricisi, front-end web developer" },
    author: { name: "author", content: "Derviş Öksüzoğlu" },
    owner: { name: "owner", content: "Derviş Öksüzoğlu" },
    canonical: { rel: "canonical", href: "https://dervisoksuzoglu.xyz" },
    copyright: { name: "copyright", content: "CC0-1.0 Universal License" },
    "og:type": { property: "og:type", content: "website" },
    "og:url": { property: "og:url", content: "https://dervisoksuzoglu.xyz" },
    "og:title": { property: "og:title", content: "Derviş Öksüzoğlu" },
    "og:description": { property: "og:description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
    "og:image": { property: "og:image", content: "https://dervisoksuzoglu.xyz/src/assets/images/static/webp/logo.webp" },
    "twitter:card": { name: "twitter:card", content: "summary_large_image" },
    "twitter:url": { name: "twitter:url", content: "https://dervisoksuzoglu.xyz" },
    "twitter:title": { name: "twitter:title", content: "Derviş Öksüzoğlu" },
    "twitter:description": { name: "twitter:description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
    "twitter:image": { name: "twitter:image", content: "https://dervisoksuzoglu.xyz/src/assets/images/static/webp/logo.webp" },
    robots: { name: "robots", content: "index, follow, noarchive, max-snippet: -1, max-image-preview:standard" },
    "revisit-after": { name: "revisit-after", content: "7 days" },
    "geo.region": { name: "geo.region", content: "TR-34" },
    "geo.placename": { name: "geo.placename", content: "Istanbul" }
};

// Static page configuration
const htmlPageNames = ["about.html", "admin.html", "updates.html", "404.html", "work.html"];
const multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/pages/static/${name}`),
        filename: `${name}`,
        inject: "body",
        minify: false,
        chunks: ["main"],
        meta: htmlWebpackPluginMeta,
        cache: true,
        hash: true,
        alwaysWriteToDisk: true
    });
});

module.exports = {
    mode: "development",
    entry: {
        main: "./src/main.ts",
        worker: { import: "./src/worker.ts", filename: "worker.js" },
    },
    output: {
        publicPath: "/",
        filename: "js/[name].js",
        chunkFilename: "js/[name].chunk.js",
        path: path.resolve(__dirname, "public"),
        clean: {
            keep: "public/index.html",
        },
    },
    devtool: "cheap-module-source-map",
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
            publicPath: "/",
        },
        compress: false,
        historyApiFallback: true, // Support client-side routing
        client: {
            logging: "info",
            overlay: {
                errors: true,
                warnings: true,
                runtimeErrors: true,
            },
            progress: true,
            reconnect: 5,
        },
        port: 1234,
        host: "0.0.0.0",
        hot: true,
        liveReload: true,
        watchFiles: {
            paths: ["src/**/*"],
            options: {
                usePolling: true,
                poll: 1000,
            },
        },
    },
    watchOptions: {
        poll: 1000,
        ignored: /node_modules/,
        aggregateTimeout: 300, // wait for rebuilding
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                include: [path.resolve(__dirname, "src")],
                exclude: /node_modules/,
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i,
                type: "asset/resource",
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024, // Inline images smaller than 8KB
                    },
                },
                generator: {
                    filename: "assets/images/[name][ext]",
                },
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[name][ext]",
                },
            },
            {
                test: /\.(mp4|webm|ogg|mov)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/videos/[name][ext]",
                },
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js", "..."],
    },
    optimization: {
        usedExports: false,
        removeEmptyChunks: true,
        removeAvailableModules: false,
        realContentHash: false,
        chunkIds: "named",
        moduleIds: "named",
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: 10,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
        minimize: false,
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["**/*", "!.gitkeep"],
            cleanAfterEveryBuildPatterns: ["!index.html"],
            dry: false,
            verbose: false,
        }),
        new NodePolyfillPlugin(),
        new Dotenv({
            path: "./.env",
            safe: true,
            allowEmptyValues: true, // Allow empty values in dev
            systemvars: true,
            silent: true,
            defaults: false,
            override: true,
            expand: true,
        }),
        new WebpackManifestPlugin({
            fileName: "asset-manifest.json",
            useLegacyEmit: false,
            publicPath: "/",
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/images"),
                    to: "assets/images",
                    noErrorOnMissing: true,
                    globOptions: {
                        ignore: ["**/.DS_Store"],
                    },
                },
                {
                    from: path.resolve(__dirname, "src/assets/videos"),
                    to: "assets/videos",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "src/assets/3d"),
                    to: "assets/3d",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "src/assets/files"),
                    to: "assets/files",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "src/php"),
                    to: "php",
                    noErrorOnMissing: true,
                },
                {
                    from: path.resolve(__dirname, "vendor"),
                    to: "php/vendor",
                    noErrorOnMissing: true,
                }
            ],
        }),
        new MiniCssExtractPlugin({
            linkType: "text/css",
            filename: "css/[name].css",
            chunkFilename: "css/[name].chunk.css",
            ignoreOrder: true, // Don't warn about order in dev
        }),
        new PurgeCSSPlugin({
            paths: glob.sync([
                path.join(__dirname, "./src/**/*.html"),
                path.join(__dirname, "./src/**/*.ts"),
                path.join(__dirname, "./src/**/*.js"),
                path.join(__dirname, "./src/**/*.scss"),
                path.join(__dirname, "./src/**/*.sass")
            ], globPatterns, { posix: true, dotRelative: true }),
            safelist: {
                standard: ["html", "body"],
            },
            only: ["public"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: "body",
            minify: false, // stop minification in development
            meta: htmlWebpackPluginMeta,
            cache: true,
            hash: true,
            alwaysWriteToDisk: true,
        }),
        new HtmlWebpackHarddiskPlugin(),
        new FaviconsWebpackPlugin({
            logo: "./src/assets/images/static/webp/logo_256x256.webp",
            cache: false, // stop rebuilding favicons each time in dev
            prefix: "assets/favicons/",
            inject: true,
        }),
        new WebpackPwaManifest({
            name: "Derviş Öksüzoğlu",
            short_name: "Derviş Öksüzoğlu",
            description: "İngilizce Öğretmeni & Web Geliştirici",
            background_color: "#F9C80E",
            start_url: "/",
            scope: "/",
            display: "standalone",
            crossorigin: "use-credentials",
            fingerprints: false,
            ios: false,
            orientation: "portrait-primary",
            icons: [
                {
                    src: path.resolve("./src/assets/images/static/webp/logo_512x512.webp"),
                    sizes: [96, 128, 192, 256, 384, 512],
                    destination: path.join("assets", "pwa-icons"),
                    purpose: "any"
                }
            ]
        }),
        new CspHtmlWebpackPlugin(
            {
                "base-uri": ["'self'"],
                "object-src": ["'none'"],
                "script-src": ["'self'", "'unsafe-inline'", ...scripts],
                "style-src": ["'self'", "'unsafe-inline'"],
                "img-src": ["'self'", "data:", "blob:", ...imageConnections],
                "font-src": ["'self'"],
                "connect-src": [
                    "'self'",
                    "blob:",
                    "https://www.google-analytics.com",
                    "https://www.google.com/recaptcha/",
                    "https://www.gstatic.com/recaptcha/",
                    "https://api.github.com/repos/gokacinlar/"
                ],
                "frame-src": ["https://www.google.com/recaptcha/"]
            },
            {
                enabled: true,
                hashingMethod: "sha256",
                hashEnabled: {
                    "script-src": false,
                    "style-src": false
                },
                nonceEnabled: {
                    "script-src": false,
                    "style-src": false
                }
            }
        ),
    ].concat(multipleHtmlPlugins)
};