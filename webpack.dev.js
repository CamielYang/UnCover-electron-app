const fs = require("fs");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const packageJson = fs.readFileSync("./package.json");
const externals = {};

Object.keys(JSON.parse(packageJson.toString())['dependencies']).forEach((dependency) => {
    externals[dependency] = "commonjs " + dependency;
});

const mainConfig = [
    {
        entry: {
            main: './src/main/main.js',
        },
        target: 'electron-main',
    }
];

const preloadConfig = [
    {
        entry: {
            preload: './src/preload/preloadIndex.js',
            browserPreload: './src/preload/browserPreload.js',
        },
        externals: externals,
        target: 'electron-preload',
    }
];

const rendererConfig = [
    {
        devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
        entry: {
            index: './src/renderer/js/index.js',
            webBrowser: './src/renderer/js/webBrowser.js',
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './src/renderer/index.html',
                inject: true,
                chunks: ['index'],
                scriptLoading: 'module',
                ilename: 'index.html'
            }),
            new HtmlWebpackPlugin({
                template: './src/renderer/components/webBrowser.html',
                inject: true,
                chunks: ['webBrowser'],
                filename: 'webBrowser.html'
            }),
            new HtmlWebpackPlugin({
                template: './src/renderer/splash.html',
                chunks: ['splash'],
                filename: 'splash.html'
            }),
            new RemoveEmptyScriptsPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new CopyPlugin({
                patterns: [
                    { from: "./src/renderer/templates", to: "templates" },
                    { from: "./resources", to: "resources" },
                ],
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        "css-loader"
                    ],
                },
                {
                    test: /\.(png|svg|jpg|jpeg|gif)$/i,
                    type: 'asset/resource',
                    generator: {
                        filename: 'assets/[name].[hash][ext][query]'
                    }
                },
            ],
        },
        optimization: {
            minimizer: [
                '...',
                new CssMinimizerPlugin(),
            ],
            minimize: process.env.NODE_ENV === 'production' ? true : false,
        }
    }
];

module.exports = [
    mainConfig,
    preloadConfig,
    rendererConfig
].flat();
