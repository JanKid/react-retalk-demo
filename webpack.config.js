const path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader'],
        exclude: path.resolve(__dirname, 'node_modules/')
      // query: {compact: false}
      }
    ]
  },
  devtool: 'source-map',
  devServer: {
    hot: true,
    port: 3000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
