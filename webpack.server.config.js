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
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, "dist"), // Separate folder for server.js
        libraryTarget: "commonjs2"
    },
    mode: "development" // Later change to production
}