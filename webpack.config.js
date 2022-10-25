/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
//Use this to load modules whose location is specified in the paths section of tsconfig.json when using webpack.
const sharedConfig = require('./webpack.shared');

const PATHS = {
  entryPoint: path.resolve(__dirname, 'main/src/lib/index.ts'),
  bundles: path.resolve(__dirname, './dist'),
  tsConfigPath: path.resolve(__dirname, './tsconfig.json')
};

// noinspection JSValidateTypes
module.exports = {
  mode: 'production',
  // Activate source maps for the bundles in order to preserve the original source when the user debugs the application
  devtool: 'source-map',
  entry: {
    index: PATHS.entryPoint,
    'index.min': PATHS.entryPoint
  },
  output: {
    path: PATHS.bundles,
    filename: '[name].js', //[name] is specified by the entry block above
    library: {
      type: 'umd',
      name: 'ValidatedForm', //When including the bundle in the browser it will be accessible at `window.ValidatedForm`
      umdNamedDefine: true //together with type it tells to create a UMD module and to name it with the name of the lib
    }
  },
  resolve: sharedConfig.resolve,
  module: {
    rules: [...sharedConfig.loaders]
  },
  externalsPresets: {node: true}, // in order to ignore built-in modules like path, fs, etc.
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        include: /\.min\.js$/,
        terserOptions: {
          sourceMap: true
        }
      })
    ]
  }
};
