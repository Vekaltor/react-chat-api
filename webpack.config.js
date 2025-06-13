const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    target: 'node', // Informuje webpack, że budujemy dla Node.js
    entry: './src/server.js', // Punkt wejścia aplikacji, dostosuj ścieżkę do swojej głównej aplikacji
    output: {
        path: path.resolve(__dirname, 'dist'), // Katalog docelowy dla zbudowanego pliku
        filename: 'app.bundle.js' // Nazwa pliku wyjściowego
    },
    externals: [nodeExternals()], // Wyklucza node_modules z pakietu
    module: {
        rules: [
            {
                test: /\.js$/, // Transformuje pliki .js
                exclude: /node_modules/, // Ignoruje node_modules
                use: {
                    loader: 'babel-loader', // Używa Babel do transpilacji kodu JS
                    options: {
                        presets: ['@babel/preset-env'], // Dostosowuje do najnowszych standardów ECMAScript
                        plugins: [
                            '@babel/plugin-proposal-class-properties',
                            '@babel/plugin-proposal-object-rest-spread'
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js'], // Rozszerzenia plików, które Webpack będzie traktował jako moduły JS
    }
};
