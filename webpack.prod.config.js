var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: __dirname + '/src/index.html',
  filename: 'index.html',
  inject: 'body'
});
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    src: __dirname + '/src/client/app.jsx',
    css: __dirname + '/src/styles.scss',
    vendor: [ 'react', 'react-dom', 'react-router', 'jquery', 'bootstrap-sass' ],
  },
  cache: true,
  output: {
    path: __dirname + '/build',
    filename: "[name].js",
    chunkFilename: "[id].js",
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /bootstrap-sass\/assets\/javascripts\//,
        loader: 'imports?jQuery=jquery'
      },
      {
        test: /\.jsx?$/,
        include: __dirname + '/src/client',
        exclude: __dirname + '/node_modules',
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      },
      {
        test: /\.scss$/,
        include: __dirname + '/src',
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
      },
      {
        test: /\.(woff2?|svg)$/,
        loader: 'url?limit=10000'
        },
      {
        test: /\.(ttf|eot)$/,
        loader: 'file'
      },
    ]
  },
  devtool: "source-map",
  node: {
    fs: "empty"
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new ExtractTextPlugin("styles.css", { allChunks: true }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};
