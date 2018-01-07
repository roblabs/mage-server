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
      }, {
        loader: 'css-loader'
      }]
    }],
    rules: [{
      test: /\.css$/,
      use: ['css-loader']
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
