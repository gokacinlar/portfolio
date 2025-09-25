const path = require("path");
const webpack = require("webpack");
const dotenv = require("dotenv");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const Dotenv = require("dotenv-webpack");

// Load .env
dotenv.config();
const envKeys = ["GTAG", "WEB3_FORM_ACCESS_KEY"];
const definePluginEntries = {};

envKeys.forEach((key) => {
    definePluginEntries[`process.env.${key}`] = JSON.stringify(process.env[key]);
});

// For static page"s script linking
let htmlPageNames = ["about.html", "updates.html", "404.html"];
let multipleHtmlPlugins = htmlPageNames.map(name => {
    return new HtmlWebpackPlugin({
        template: path.resolve(__dirname, `./src/pages/static/${name}`),
        filename: `${name}`,
        inject: "body",
        minify: false,
        chunks: ["main"]
    })
});

// CspHtmlWebpackPlugin related outer connections regarding trusted scripts
let scripts = [
    "https://web3forms.com/client/script.js",
    "https://api.web3forms.com/submit",
    "https://www.googletagmanager.com/gtag/js?id=G-XMT56BGFP8&l=ga4DataLayer"
];

let apis = [
    "https://api.hashnode.com/"
]

// Footer images
let imageConnections = [
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
            keep: "public/index.html",
        },
    },
    mode: "development", // Later change this to "production" for final result
    devtool: "cheap-module-source-map", // Later remove for production since we won"t be needing eval() in prod
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
    // For copying static assets as a whole without importing them individually
    plugins: [
        new webpack.DefinePlugin(definePluginEntries),
        new NodePolyfillPlugin(),
        new Dotenv({
            path: "./.env",
            safe: true,
            allowEmptyValues: false,
            systemvars: true,
            silent: false,
            defaults: false,
            prefix: "import.meta.env.",
            override: true
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
            template: path.resolve(__dirname, "public/index.html"),
            inject: "body",
            minify: false,
            template: "./src/index.html",
            filename: "./index.html",
            meta: {
                description: { name: "description", content: "Derviş Öksüzoğlu: İngilizce Öğretmeni & Front-end Web Geliştiricisi; Pedagoji, Teknoloji, Bilim ve Sanat | Eğitimin teknoloji ile buluştuğu yer." },
                keywords: { name: "keywords", content: "derviş, öksüzoğlu, derviş öksüzoğlu, blog, portfolyo, ingilizce öğretmeni, english teacher, web geliştiricisi, front-end web developer" },
                author: { name: "author", content: "Derviş Öksüzoğlu" },
                owner: { name: "owner", content: "Derviş Öksüzoğlu" },
                canonical: { rel: "canonical", href: "https://dervisoksuzoglu.com.tr" },
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
                "connect-src": ["'self'", ...apis],
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