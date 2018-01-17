var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    app: './main.js',
    vendor: ['angular', 'angular-animate', 'angular-messages', 'angular-resource', 'angular-route', 'angular-sanitize']
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.css$/,
      use: [{
        loader: 'style-loader'
      },{
        loader: 'css-loader'
      }]
    },{
      test: /\.(eot|svg|ttf|woff|woff2)$/,
      loader: 'file-loader?name=fonts/[name].[ext]'
    },{
      test: /marker-icon\.png/,
      use: [{
        loader: 'file-loader',
        options: {}
      }]
    },{
      test: /\.(png|jpg)$/,
      loader: 'url-loader?name=images/[name].[ext]'
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({'window.jQuery': 'jquery'}),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      file: 'vendor.bundle.js'
    })
  ]
};
