/**
* @author Amit Raushan <amiraush@publicis@groupe.net>
* @description Builds every module which application needs,and then packages all of those modules into bundles.
*/

import path from 'path';
import webpack from 'webpack'; //to access built-in plugins
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

//get the environment from terminal
const env = process.env.npm_config_env;

//plugins common to both development and producton environment
const commonPlugins = [

    //Extract text from a bundle into a separate(css) file.
    new ExtractTextPlugin('./[name].css'),

    // creates a separate file consisting of common modules shared between multiple
    // entry points
    new webpack
        .optimize
        .CommonsChunkPlugin({ name: 'commons', filename: 'common/commons.bundle.js' }),

    // generate an HTML5 file includes all webpack bundles in the body using script
    // tags
    new HtmlWebpackPlugin({
        // favicon: './public/favicon.ico',
        template: './public/index.html',
        chunks: [
            'main', 'commons'
        ],
        filename: 'index.html'
    })
];

//plugins necessary only in production
const prodPlugin = [

    //create global constant to determine build environment
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),

    // minify JavaScript
    new webpack
        .optimize
        .UglifyJsPlugin({ minimize: true, sourceMap: true }),

    //clean the build folder before building
    new CleanWebpackPlugin(['dist'])
];

export default {
    entry: {
        main: './src/'
    },
    output: {
        //the target directory for all output files
        path: path.join(__dirname, 'dist'),
        // the filename template for entry chunks
        filename: '[name].bundle.js'
    },
    module: {
        // rules for modules
        rules: [
            {
                //RegExp for matching the mentioned extension
                test: /\.jsx?$/,
                exclude: /node_modules/, //files the loader should ignore
                use: [
                    {
                        //transpiles JavaScript files using Babel and webpack
                        loader: 'babel-loader'

                    }, {
                        //eslint loader for webpack
                        loader: 'eslint-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    // Adds CSS to the DOM by injecting a <style> tag in case ExtractTextPlugin
                    // fails to create a separate css file
                    fallback: 'style-loader',
                    use: [
                        {
                            //loads CSS file with resolved imports and returns CSS code
                            loader: 'css-loader',
                            options: env === 'production'
                                ? {
                                    //minifiy the css file
                                    minimize: true
                                }
                                : {
                                    minimize: false
                                }
                        }, {
                            //api which let us use postcss plugins
                            loader: 'postcss-loader'
                        }
                    ]
                })
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                use: [
                    {
                        //emits the required object as file
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/images/', //custom output path for the file
                        }
                    }
                ]
            },
            {
                test: /.(ttf|otf|eot|woff2|woff)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts/', // where the fonts will go
                        }
                    }
                ]
            }, 
        ]
    },
    
    // enhance debugging by adding meta info for the browser devtools
    devtool: 'source-map',

    plugins: env === 'production'
        ? commonPlugins.concat(prodPlugin)
        : commonPlugins
};
