### ESLint Dependencies

eslint-config-prettier: Turns off all ESLint rules that have the potential to interfere with Prettier rules.
eslint-plugin-prettier: Turns Prettier rules into ESLint rules.

### .babelrc

["@babel/env",{"targets": "> 1%, maintained node versions"}] -> > 1% - All the browsers with a market share bigger than 1%,
maintained node versions - All the currently maintained nodejs versions, see: https://nodejs.org/en/about/releases/

### webpack.config
output: {
    path: path.resolve(__dirname, './dist'),
    filename: "index.ts",
    library: {
    type: "umd",
    name: "formValidation",
    umdNamedDefine: true //together with type it tells to create a UMD module and to name it with the name of the lib
    },
}
library.name - the library name. Will be used to consume the library.
library.type: 'umd' - will make the library available when using AMD or CommonJS
library.umdNamedDefine: true //together with type it tells to create a UMD module and to name it with the name of the lib
globalObject: 'this' - will make the library publicly available by using global.evenNumbers in node or window.evenNumbers in the browser.

### package.json
Make the library available by the library name when using AMD or CommonJS.
{
    "main": "dist/index.ts",
    "module": "src/lib/index.ts"
}
See [using module vs main](https://webpack.js.org/guides/author-libraries/#final-steps). Main is used since module is a proposal
If your package.json file also has a module field, ES6-aware tools like Rollup and webpack 2 will import the ES6 module version directly.(source: [Rollupjs compatibility](https://rollupjs.org/#compatibility))
The main field makes sure that Node users using require will be served the UMD version. The module field is not an official npm feature but a common convention among bundlers to designate how to import an ESM version of our library. (source: [Code-splitting for libraries—bundling for npm with Rollup 1.0](https://levelup.gitconnected.com/code-splitting-for-libraries-bundling-for-npm-with-rollup-1-0-2522c7437697#9f6f))
This will make the library available to import/require while using the library name.
import { isEven, isOdd } from 'even-numbers';

### Typescript

## Issue 1: Keeping Webpack path resolve aliases and Typescript path aliases in sync

To keep webpack module path aliases in sync with Typescript option ["paths"](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping), [tsconfig-paths-webpack-plugin](https://www.npmjs.com/package/tsconfig-paths-webpack-plugin) is used.

## Issue 2: Typescript module paths aliases

When typescript compiles with "paths" option (to alias relative long paths) the compiled index.d.ts or whatever files using those aliases incorrectly keep those aliases instead of substituting them with paths relative to dist (output folder).
Following compilation those aliases has to be fixed for type declaration files or compiled files to reference each other if they were using aliases.
 There were 2 options.
1. [tsc-alias](https://github.com/justkey007/tsc-alias) which requires a script to be run following compile with a config file specific to that app which goes and traverse the output folder to update alias paths with relative paths to output folder. This is more robust option than the one we choose (patching tsc during npm install phase and introduce plugin config) since it is not a hack just an additional script running step. However, seeing config for path alias transformation in tsconfig was more natural.
2. [Webpack loader for babel-plugin-module-resolver](https://github.com/stavalfi/babel-plugin-module-resolver-loader) no updates to this within the last 3 years was discouraging.
3. Used: [typescript-transform-paths](https://github.com/LeDDGroup/typescript-transform-paths) which is a typescript plugin, however, Typescript does not have a plugin system to allow for such fix. So in addition to that [ts-patch](https://github.com/nonara/ts-patch) has to be installed and added as package.json "prepare" script (runs whenever npm install runs), patching tsc to make use of the plugin to transform alias paths in compiled files.

[microsoft/TypeScript#15479](https://github.com/microsoft/TypeScript/issues/15479) GitHub discussion implies that this issue is not going to be resolved soon so we needed to resort to one of those options.

### Resources
Blogs:
https://sudobird.com/blog/tech/react-library-from-scratch-webpack-babel-and-npm-publish
https://marcobotto.com/blog/compiling-and-bundling-typescript-libraries-with-webpack/ (Frontend engineer at Facebook)
https://sharvit.github.io/blog/2019-12-28-using-webpack-to-build-a-javascript-library
https://tobias-barth.net/blog/Bundling-your-library-with-Webpack

see the following repos for creating npm module libraries:
https://github.com/elboman/typescript-lib-example
https://github.com/sharvit/node-mdl-starter
https://github.com/sharvit/generator-node-mdl

ts-loader barks during compilation when it's configuration is set to emitDeclarationOnly. To avoid that a hack is suggested in webpack.config employing [EmitDeclarationOnly](https://github.com/TypeStrong/ts-loader/issues/1269#issuecomment-1030492960) class to ignore that error during build since it is not affecting the creation of type declarations.
```javascript
//In webpack.config
plugins: [new EmitDeclarationOnly()]
/**
* courtesy of: https://github.com/TypeStrong/ts-loader/issues/1269#issuecomment-1030492960
* ts-loader emits an error when no output is generated. This occurs when using Typescript's emitDeclarationOnly
* flag. This plugin suppresses that error so that webpack will consider it a clean build.
  */
  class EmitDeclarationOnly {
    apply(compiler) {
        compiler.hooks.shouldEmit.tap('EmitDeclarationOnly', (compilation) => this.handleHook(compiler, compilation));
    }
    handleHook(compiler, compilation){
        compilation.errors = compilation.errors.filter((error) => {!error.toString().includes("TypeScript emitted no output for")});
    }
  }
```
