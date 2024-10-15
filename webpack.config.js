const path = require('path');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    entry: './popup.js',
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production', // or 'development' based on your environment
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env.GOOGLE_API_KEY': JSON.stringify(process.env.GOOGLE_API_KEY),
            'process.env.VIRUSTOTAL_API_KEY': JSON.stringify(process.env.VIRUSTOTAL_API_KEY)
        })
    ]
};
