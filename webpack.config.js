const path = require("path");
const webpack = require("webpack");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");

// For static page"s script linking
const htmlPageNames = ["about.html", "updates.html", "404.html", "work.html"];
const multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/pages/static/${name}`),
        filename: `${name}`,
        inject: "body",
        minify: false, // Keep false for development, set to true for production build
        chunks: ["main"]
    })
});

// CspHtmlWebpackPlugin related outer connections regarding trusted scripts
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

module.exports = {
    // Specify our input (entry) file to be compiled
    entry: {
        main: "./src/main.ts",
    },
    // Rules defining compiling & bundling of the resulting file
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
                use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico)$/i,
                type: "asset/resource",
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
    // Specify our output directory
    output: {
        publicPath: "/",
        filename: "js/[name].[contenthash].js",
        chunkFilename: "js/[name].[contenthash].chunk.js",
        path: path.resolve(__dirname, "public"),
        clean: {
            keep: "public/index.html", // This will keep the initial index.html if it exists, but HtmlWebpackPlugin will overwrite it.
        },
    },
    mode: "development", // Later change this to "production" for final result
    devtool: "source-map", // Later remove for production since we won"t be needing eval() in prod
    devServer: {
        static: {
            directory: path.join(__dirname, "public"),
        },
        compress: false,
        client: {
            logging: "warn",
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },
        port: 1234,
        host: "0.0.0.0",
        hot: true,
        watchFiles: ["src/**/*"] // For constant changes
    },
    watchOptions: {
        poll: 1000, // Every 1s check for changes automatically
        ignored: /node_modules/,
    },
    resolve: {
        extensions: [".ts", ".js", "..."],
    },
    optimization: {
        usedExports: false,
        removeEmptyChunks: true,
        removeAvailableModules: true,
        realContentHash: true,
        chunkIds: "total-size",
        splitChunks: {
            chunks: "async",
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                    enforce: true
                },
            },
        },
        minimize: true,
        minimizer: [
            new TerserWebpackPlugin({
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
            new CssMinimizerPlugin()
        ],
    },
    plugins: [
        /* new BundleAnalyzerPlugin({
            analyzerMode: "static",
            openAnalyzer: false,
            generateStatsFile: true,
            statsFilename: "statistics.json",
        }) */,
        new CleanWebpackPlugin(),
        new ESLintPlugin(),
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
            fileName: "asset-manifest",
            useLegacyEmit: true
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
            filename: "css/[name].[contenthash].css",
            chunkFilename: "css/[name].[contenthash].chunk.css",
            attributes: {
                media: "print"
            }
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "./index.html",
            inject: "body",
            minify: false,
            meta: {
                description: { name: "description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
                keywords: { name: "keywords", content: "derviş, öksüzoğlu, derviş öksüzoğlu, blog, portfolyo, ingilizce öğretmeni, english teacher, web geliştiricisi, front-end web developer" },
                author: { name: "author", content: "Derviş Öksüzoğlu" },
                owner: { name: "owner", content: "Derviş Öksüzoğlu" },
                canonical: { rel: "canonical", href: "https://dervisoksuzoglu.com.tr" },
                copyright: { name: "copyright", content: "CC0-1.0 Universal License" },
                // Open Graph
                "og:type": { property: "og:type", content: "website" },
                "og:url": { property: "og:url", content: "https://dervisoksuzoglu.com.tr" },
                "og:title": { property: "og:title", content: "Derviş Öksüzoğlu" },
                "og:description": { property: "og:description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
                "og:image": { property: "og:image", content: "https://dervisoksuzoglu.com.tr/src/assets/images/static/webp/logo.webp" },
                // Twitter/X
                "twitter:card": { name: "twitter:card", content: "summary_large_image" },
                "twitter:url": { name: "twitter:url", content: "https://dervisoksuzoglu.com.tr" },
                "twitter:title": { name: "twitter:title", content: "Derviş Öksüzoğlu" },
                "twitter:description": { name: "twitter:description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
                "twitter:image": { name: "twitter:image", content: "https://dervisoksuzoglu.com.tr/src/assets/images/static/webp/logo.webp" },
                robots: { name: "robots", content: "index, follow, noarchive, max-snippet: -1, max-image-preview:standard" },
                "revisit-after": { name: "revisit-after", content: "7 days" },
                "geo.region": { name: "geo.region", content: "TR-34" },
                "geo.placename": { name: "geo.placename", content: "Istanbul" }
            },
            hash: true
        }),
        new CspHtmlWebpackPlugin(
            {
                "base-uri": ["'self'"],
                "object-src": ["'none'"],
                "script-src": ["'self'", ...scripts],
                "style-src": ["'self'"],
                "img-src": ["'self'", "data:", ...imageConnections],
                "font-src": ["'self'"],
                "connect-src": [
                    "'self'",
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
        )
    ].concat(multipleHtmlPlugins)
};