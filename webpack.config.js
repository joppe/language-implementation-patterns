const path = require('path');

const config = {
    devtool: 'source-map',
    devServer: {
        port: 9000
    },
    entry: {
        main: './src/main.ts'
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loaders: [
                    'ts-loader'
                ]
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist'
    },
    resolve: {
        alias: {
            app: path.resolve(__dirname, 'src')
        },
        extensions: [
            '.js', '.ts', '.tsx'
        ]
    }
};

module.exports = config;
