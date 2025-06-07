// Use path module to create absolute path in output obj.
import 'path';

module.exports = {
    // Specify our input (entry) file to be compiled
    entry: {
        main: "/src/main.ts"
    },
    // Rules defining compiling & bundling of the result file
    module: {
        rules: [{
            test: /\.ts$/, // Look for .ts files: RegExp means look for ts files at the end
            use: "ts-loader", // Compile .ts > .js
            include: [path.resolve(__dirname, "src")], // Where .ts files are located
            exclude: /node_modules/,
        }]
    },
    // Specify our output directory
    output: {
        // Tell webpack to serve compiled JS to actual file for live changes
        publicPath: "public",
        filename: "bundle.js",
        //.resolve's first parameter search for in the directory
        // for absolute path and public is our result
        path: path.resolve(__dirname, "public")
    },
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, 'public')
        },
        compress: false,
        client: {
            logging: "warn",
            overlay: {
                errors: true,
                warnings: false
            },
            progress: true
        },
        port: 1234,
        host: "0.0.0.0"
    }

};
