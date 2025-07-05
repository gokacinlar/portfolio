const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    // Define server entry
    entry: {
        main: "./src/server.ts"
    },
    target: "node",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s?[ac]ss$/i,
                use: [
                    {
                        loader: "css-loader",
                        options: {
                            modules: {
                                exportOnlyLocals: true, // Only export CSS class names, not styles
                            },
                        },
                    },
                    "sass-loader"
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg|ico|woff|woff2|ttf|eot|mp4|webm|ogg|mov)$/i,
                type: "asset/resource",
                generator: {
                    filename: "assets/[name][ext]",
                    emit: false, // Don't emit files on server build
                },
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "commonjs2"
    },
    mode: "development"
};