const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CspHtmlWebpackPlugin = require("csp-html-webpack-plugin");

// For static page's script linking
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

// CspHtmlWebpackPlugin related outer connections
let scripts = ["https://web3forms.com/client/script.js",
    "https://api.web3forms.com/submit",
    "https://platform.twitter.com/widgets.js",
    "https://platform.twitter.com/js/",
    "https://www.googletagmanager.com/gtag/js?id=G-XMT56BGFP8&l=ga4DataLayer"];

// Footer images
let imageConnections = ["https://creativecommons.org/publicdomain/zero/1.0/",
    "https://notbyai.fyi/",
    "https://raw.githubusercontent.com"];

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
    devtool: "cheap-module-source-map", // Later remove for production since we won't be needing eval() in prod
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
        }),
        new CspHtmlWebpackPlugin(
            {
                "base-uri": ["'self'"],
                "object-src": ["'none'"],
                "script-src": ["'self'", ...scripts],
                "style-src": ["'self'"],
                "img-src": ["'self'", "data:", ...imageConnections],
                "font-src": ["'self'", "https:", "data:"],
                "connect-src": ["'self'"],
                "frame-ancestors": ["'none'"]
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