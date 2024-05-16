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
    test: /\.(ts|tsx)$/,
    exclude: [/node_modules/],
    use: {
      loader: 'babel-loader'
    }
  },
  {
    test: /\.(ts|tsx)$/,
    exclude: [/node_modules/],
    loader: 'ts-loader'
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
