const path = require('path');
const Webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  devtool: 'source-map',
  externals: ['aws-sdk'],

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: [require('babel-preset-stage-2')],
          plugins: [require('babel-plugin-transform-es2015-modules-commonjs')]
        },
        exclude: [/node_modules/]
      }
    ]
  },
  resolve: {
    alias: {
      "graphql": path.resolve(__dirname, "node_modules/graphql")
    }
  },
  plugins: [
    new Webpack.NoEmitOnErrorsPlugin()
  ]
};
