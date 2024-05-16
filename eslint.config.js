const path = require('path');
const typescriptParser = require('@typescript-eslint/parser');
const globals = require('globals');
const eslint = require('@eslint/js').configs.recommended;
const chai = require('eslint-plugin-chai-friendly');
const cypress = require('eslint-plugin-cypress').configs.recommended;
const react  = require('eslint-plugin-react').configs.recommended;
const reactHooks  = require('eslint-plugin-react-hooks').configs.recommended;
const css  = require('eslint-plugin-css').configs.recommended;
const html = require('eslint-plugin-html');
const prettier = require('eslint-plugin-prettier');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');
const eslintConfigPrettier = require('eslint-config-prettier');
const babel = require('@babel/eslint-plugin');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = {
  files: ["./main/**"],
  ignores: ["**/templates/**", "**/dist/**", "coverage/*", "docs/*", "package-lock.json", "package.json", "**/node_modules/**/*", "yarn.lock", "**/build/**/*", "*.scss"],
  eslint,
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  react,
  reactHooks,
  cypress,
  css,
  html,
  plugins:{
    chai,
    prettier,
    babel,
    '@stylistic': stylistic
  },
  languageOptions: {
    parser: typescriptParser,
    globals: {
      ...globals.browser,
      ...globals.es2021,
      ...globals.node
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      allowImportExportEverywhere: false,
      codeFrame: false,
      ecmaFeatures: {
        jsx: true
      },
      babelOptions: {configFile: path.resolve(__dirname, '.babelrc')}
    }
  },
  rules: {
    'no-console': 'warn',
    'prettier/prettier': 'error',
    '@stylistic/linebreak-style': ['off', 'unix'],
    '@stylistic/quotes': ['error', 'single', {avoidEscape: true}],
    '@stylistic/semi': ['error', 'always'],

    '@stylistic/comma-dangle': 'off',
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
