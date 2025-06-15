const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

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
                test: /\.(woff2?|eot|ttf|otf)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/fonts/[name][ext]",
                },
            },
        ],
    },
    // Specify our output directory
    output: {
        publicPath: "/",
        filename: "bundle.js",
        path: path.resolve(__dirname, "public")
    },
    mode: "development", // Later change this to "production" for final result
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
        extensions: [".ts", ".js"],
    },
    optimization: {
        minimizer: [
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
            ],
        }),
        new MiniCssExtractPlugin()
    ],
};
