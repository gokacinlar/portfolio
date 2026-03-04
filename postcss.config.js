/** @type {import("postcss-load-config").Config} */
const config = {
    syntax: "postcss-scss",
    plugins: [
        require("autoprefixer")({
            overrideBrowserslist: ["last 2 versions"]
        }),
        require("postcss-nested")
    ]
}

module.exports = config