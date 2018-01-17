var webpack = require('webpack')
  , ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: __dirname,
  entry: {
    app: './main.js',
    vendor: [
      'angular',
      'angular-animate',
      'angular-messages',
      'angular-resource',
      'angular-route',
      'angular-sanitize',
      'leaflet'
    ]
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    },{
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    },{
      test: /\.(png|jpg)$/,
      loader: 'file-loader?name=images/[name].[ext]'
    },{
      test: /\.html$/, loader: 'raw-loader'
    }]
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new webpack.ProvidePlugin({'window.jQuery': 'jquery'}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      file: 'vendor.bundle.js'
    })
  ]
};
