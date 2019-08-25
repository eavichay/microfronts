const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const distFolder = path.resolve(__dirname, 'dist')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
    entry: './src/index.js',
    output: {
        path: distFolder,
        filename: '[name].bundle.js'
    },

    // if NODE_ENV is set to "production" webpack will also minify the files
    mode: isProduction ? 'production' : 'development',

    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: 9000
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.ts$/,
                loader: 'ts-loader'
            },
            {
                test: /\.(scss|css|sass)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.html?$/,
                loader: 'html-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/,
                loaders: [
                    'file-loader?hash=sha512&digest=hex&name=[hash].[ext]',
                    {
                        loader: 'image-webpack-loader?bypassOnDebug&optimizationLevel=7&interlaced=false',
                        query: {
                            mozjpeg: {
                              progressive: true,
                            },
                            gifsicle: {
                              interlaced: false,
                            },
                            optipng: {
                              optimizationLevel: 4,
                            },
                            pngquant: {
                              quality: '75-90',
                              speed: 3,
                            },
                        }
                    }
                ]
            }
        ]
    },

    // no source maps for production
    devtool: isProduction ? undefined : 'source-map',

    target: 'web',
    stats: 'errors-only',

    plugins: [
        new CleanWebpackPlugin([distFolder]),
        new CopyWebpackPlugin([
            {
                from: 'src/assets',
                to: distFolder + '/assets'
            },
            {
                from: 'manifest.json',
                to: distFolder
            },
            {
                from: 'sw.js',
                to: distFolder
            },
            {
                from: 'icons',
                to: distFolder + '/icons'
            }
        ]),
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ]
}