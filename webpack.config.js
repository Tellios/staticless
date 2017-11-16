const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: "./src/client/app.tsx",

    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "dist/client")
    },

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"]
    },

    devtool: "inline-source-map",

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "awesome-typescript-loader",
                        options: {
                            configFileName: "./src/client/tsconfig.json"
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: "./src/client/index.html" },
            { from: "./src/client/app.css" },
            { from: "./src/client/favicon.ico" },
            { from: "./config.json", to: "../config.json" },
            { from: "./node_modules/highlight.js/styles/atom-one-dark.css", to: "code-block-styles/dark.css" },
            { from: "./node_modules/highlight.js/styles/atom-one-light.css", to: "code-block-styles/light.css" }
        ])
    ]
}