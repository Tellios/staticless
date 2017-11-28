const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = (env) => {
    const clientFiles = [
        { from: "./src/client/index.html" },
        { from: "./src/client/app.css" },
        { from: "./src/client/favicon.ico" },
        { from: "./node_modules/highlight.js/styles/atom-one-dark.css", to: "code-block-styles/atom-one-dark.css" },
        { from: "./node_modules/highlight.js/styles/atom-one-light.css", to: "code-block-styles/atom-one-light.css" },
        { from: "./node_modules/highlight.js/styles/monokai.css", to: "code-block-styles/monokai.css" },
        { from: "./node_modules/highlight.js/styles/solarized-dark.css", to: "code-block-styles/solarized-dark.css" },
        { from: "./node_modules/highlight.js/styles/solarized-light.css", to: "code-block-styles/solarized-light.css" },
        { from: "./node_modules/highlight.js/styles/tomorrow.css", to: "code-block-styles/tomorrow.css" }
    ];

    if (env.prod === 'false') {
        clientFiles.push({ from: "./staticless.json", to: "../staticless.json" });
    }

    return {
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
                },
                {
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: [
                        { loader: "style-loader" },
                        {
                            loader: "css-loader",
                            options: {
                                modules: true,
                                namedExport: true,
                                importLoaders: 2,
                                localIdentName: "[local]__[hash:base64:5]"
                            }
                        },
                        { loader: "postcss-loader" }
                    ]
                }
            ]
        },

        plugins: [
            new CopyWebpackPlugin(clientFiles)
        ]
    }
}
