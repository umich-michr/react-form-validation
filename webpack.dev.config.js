const path = require('path');
const sharedConfig = require(path.resolve(__dirname, './webpack.shared'));
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  entryPoint: path.resolve(__dirname, './main/src/test-app/AppTestLib.tsx'),
  htmlTemplate: path.resolve(__dirname, './main/src/test-app/app-test-lib.html')
};

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: PATHS.entryPoint,
  resolve: sharedConfig.resolve,
  module: {
    rules: [...sharedConfig.loaders]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: PATHS.htmlTemplate,
      filename: 'index.html'
    })
  ],
  devServer: {
    port: 5001,
    compress: true,
    hot: true,
    // when server is set to use https with self-signed certs then the cypress component tests fail, also msw mock backend fails when running for development purposes.
    server: 'https'
  }
};
