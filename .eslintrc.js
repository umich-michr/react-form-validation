/* eslint @typescript-eslint/no-var-requires: "off" */
const path = require('path');

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    allowImportExportEverywhere: false,
    codeFrame: false,
    ecmaFeatures: {
      jsx: true
    },
    babelOptions: {configFile: path.resolve(__dirname, '.babelrc')}
  },
  env: {
    browser: true,
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:chai-friendly/recommended',
    'plugin:cypress/recommended',
    'plugin:react/recommended',
    //if using the new JSX transform from React 17 to disable the relevant rules
    'plugin:react/jsx-runtime',
    'plugin:css/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  plugins: ['@babel', 'react', 'react-hooks', 'cypress', 'html', 'css', '@typescript-eslint', 'prettier'],
  rules: {
    'no-console': 'warn',
    'prettier/prettier': 'error',
    'linebreak-style': ['off', 'unix'],
    quotes: ['error', 'single', {avoidEscape: true}],
    semi: ['error', 'always'],

    'comma-dangle': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Checks effect dependencies
    'react/prop-types': ['warn'],

    '@babel/new-cap': 'error',
    '@babel/no-invalid-this': 'error',
    '@babel/no-unused-expressions': 'error',
    '@babel/object-curly-spacing': 'error',
    '@babel/semi': 'error'
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js'
      }
    },
    react: {
      version: 'detect'
    }
  }
};
