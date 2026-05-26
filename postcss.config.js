/** @type {import("postcss-load-config").Config} */
const config = {
    syntax: "postcss-scss",
    plugins: [
        require("autoprefixer")({
            overrideBrowserslist: [
                "> 1%",
                "last 2 versions",
                "not dead"
            ]
        }),
        require("postcss-nested")
    ]
}

module.exports = config