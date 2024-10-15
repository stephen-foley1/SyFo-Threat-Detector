const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    entry: './popup.js',
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
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
        new Dotenv()
    ]
};