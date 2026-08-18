const path = require("path");
const glob = require("glob");
const fontaine = require("fontaine");
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
const CompressionPlugin = require("compression-webpack-plugin");
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
    "https://raw.githubusercontent.com"
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
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true
        },
        chunks: ["main"],
        meta: htmlWebpackPluginMeta,
        cache: true,
        hash: true,
        alwaysWriteToDisk: true
    });
});

module.exports = {
    mode: "production",
    entry: {
        main: "./src/main.ts",
        worker: { import: "./src/worker.ts", filename: "worker.js" },
    },
    output: {
        publicPath: "/",
        filename: "js/[name].[contenthash:8].js",
        chunkFilename: "js/[name].[contenthash:8].chunk.js",
        path: path.resolve(__dirname, "public"),
        clean: {
            keep: "public/index.html",
        },
        environment: {
            arrowFunction: true,
            bigIntLiteral: false,
            const: true,
            destructuring: true,
            dynamicImport: true,
            forOf: true,
            module: true,
            optionalChaining: true,
            templateLiteral: true
        }
    },
    devtool: "source-map", // Use "hidden-source-map" to exclude source maps from bundle but keep them for debugging
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
                    filename: "assets/images/[name].[contenthash:8][ext]",
                },
            },
            {
                test: /\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.eot($|\?)|\.svg($|\?)/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[name].[contenthash:8][ext]",
                },
            },
            {
                test: /\.(mp4|webm|ogg|mov)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/videos/[name].[contenthash:8][ext]",
                },
            }
        ],
    },
    resolve: {
        extensions: [".ts", ".js", "..."],
    },
    optimization: {
        usedExports: true,
        removeEmptyChunks: true,
        removeAvailableModules: true,
        realContentHash: true,
        chunkIds: "deterministic",
        moduleIds: "deterministic",
        runtimeChunk: {
            name: (entrypoint) => (entrypoint.name === "sw" ? false : "runtime"),
        },
        splitChunks: {
            chunks: (chunk) => chunk.name !== "sw",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    priority: 10,
                    chunks: "all",
                    enforce: true
                },
                common: {
                    minChunks: 2,
                    priority: 5,
                    reuseExistingChunk: true
                }
            },
        },
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    compress: {
                        drop_console: true, // Remove console.log in production
                    },
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin()
        ],
    },
    performance: {
        hints: "warning",
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    plugins: [
        new CleanWebpackPlugin(),
        new NodePolyfillPlugin(),
        new Dotenv({
            path: "./.env",
            safe: true,
            allowEmptyValues: false,
            systemvars: true,
            silent: false,
            defaults: false,
            override: true
        }),
        new WebpackManifestPlugin({
            fileName: "asset-manifest.json",
            useLegacyEmit: false,
            publicPath: "/"
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src/assets/images"),
                    to: "assets/images",
                    noErrorOnMissing: true,
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
                    from: path.resolve(__dirname, "src/assets/doc"),
                    to: "assets/doc",
                    noErrorOnMissing: true,
                    globOptions: {
                        dot: true,
                    },
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
            filename: "css/[name].[contenthash:8].css",
            chunkFilename: "css/[name].[contenthash:8].chunk.css",
        }),
        new PurgeCSSPlugin({
            paths: glob.sync([
                path.join(__dirname, "./src/**/*.html"),
                path.join(__dirname, "./src/**/*.ts"),
                path.join(__dirname, "./src/**/*.js"),
                path.join(__dirname, "./src/**/*.scss"),
                path.join(__dirname, "./src/**/*.sass")
            ]),
            safelist: {
                standard: ["html", "body"],
            },
            only: ["public"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: "body",
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true
            },
            meta: htmlWebpackPluginMeta,
            cache: true,
            hash: true,
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
        new FaviconsWebpackPlugin({
            logo: "./src/assets/images/static/webp/logo_256x256.webp",
            cache: true,
            prefix: "assets/favicons/",
            inject: true
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
            fingerprints: true,
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
                "script-src": ["'self'", ...scripts],
                "style-src": ["'self'"],
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
                    "script-src": true,
                    "style-src": true
                },
                nonceEnabled: {
                    "script-src": true,
                    "style-src": true
                }
            }
        ),
        new CompressionPlugin({
            test: /\.(js|css|html|svg)$/i,
            algorithm: "gzip",
            compressionOptions: {
                level: 9
            },
            threshold: 10240,
            minRatio: 0.8,
            deleteOriginalAssets: false
        }),
        function fontainePlugin(_context, _options) {
            return {
                name: "FontaineFallback",
                configureWebpack(_config, _isServer) {
                    return {
                        plugins: [
                            fontaine.fontaineTransform.webpack({
                                fallbacks: [
                                    "system-ui",
                                    "-apple-system",
                                    "BlinkMacSystemFont",
                                    "Segoe UI",
                                    "Roboto",
                                    "Oxygen",
                                    "Ubuntu",
                                    "Cantarell",
                                    "Open Sans",
                                    "Helvetica Neue",
                                    "sans-serif",
                                ],
                                // You may need to resolve assets like `/fonts/Poppins-Bold.ttf` to a particular directory
                                resolvePath: (id) => '/src/assets/fonts/' + id,
                            }),
                        ],
                    };
                },
            };
        },
    ].concat(multipleHtmlPlugins)
};