const path = require('path');

const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');

const mainConfig = [

];

const preloadConfig = [

];

const rendererConfig = [
    // JS
    {
        entry: {
            index: './src/renderer/js/index.js',
            webBrowser: './src/renderer/js/webBrowser.js',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, 'dist/js'),
        },
        optimization: {
            minimize: process.env.NODE_ENV === 'production' ? true : false,
        }
    },

    // CSS
    {
        entry: {
            style: './src/renderer/css/style.css',
            webBrowser: './src/renderer/css/webBrowser.css'
        },
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [MiniCssExtractPlugin.loader, "css-loader"],
                },
            ],
        },
        plugins: [
            new RemoveEmptyScriptsPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].css',
            }),
        ],
        optimization: {
            minimizer: [
                '...',
                new CssMinimizerPlugin(),
            ],
            minimize: process.env.NODE_ENV === 'production' ? true : false,
        }
    },
];

module.exports = [
    mainConfig,
    preloadConfig,
    rendererConfig
].flat();
