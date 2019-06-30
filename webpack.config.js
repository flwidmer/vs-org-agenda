'use strict';

const path = require('path');

const config = {
  target: 'node', 
  entry: './src/extension.js', 
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: {
    vscode: 'commonjs vscode' // the vscode-module is created on-the-fly and must be excluded. Add other modules that cannot be webpack'ed, 📖 -> https://webpack.js.org/configuration/externals/
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
              compilerOptions: {
                  "module": "es6" // override `tsconfig.json` so that TypeScript emits native JavaScript modules.
              }
          }
      }]
      }
    ]
  }
};

module.exports = config;