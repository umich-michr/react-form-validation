/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const tsConfigPath = path.resolve(__dirname, './tsconfig.json');
//Use this to load modules whose location is specified in the paths section of tsconfig.json when using webpack.
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

// noinspection JSValidateTypes
exports.resolve = {
  plugins: [new TsconfigPathsPlugin({configFile: tsConfigPath})],
  extensions: ['.ts', '.tsx', '.js', '.jsx']
};

exports.loaders = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  },
  {
    test: /\.(ts|tsx)$/,
    exclude: [/node_modules/],
    use: ['babel-loader', 'ts-loader']
  },
  {
    test: /\.(css|scss)$/,
    exclude: /node_modules/,
    use: [
      {
        loader: 'style-loader',
        options: {injectType: 'singletonStyleTag'}
      },
      'css-loader',
      'sass-loader'
    ]
  },
  {
    test: /\.(png|jpe?g|gif)$/i,
    loader: 'url-loader'
  }
];
