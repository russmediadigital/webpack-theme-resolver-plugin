# webpack-theme-resolver-plugin
>Webpack Theme Resolver plugin to resolve files through a directory chain with a package fallback at compile time.
For Webpack 4+

Based on the [`fallback-directory-resolver-plugin`](https://github.com/kije/webpack-fallback-directory-resolver-plugin) from kije

## Description
This is a Resolver-Plugin for webpack. It enables resolving files by looking up multiple directories in a chain with an fallback package.

This is especially useful when you need to change a single component nested inside another component or other nested components.

For example you have a library of components with a `SimpleList` containing a `ListEntry` which you'd like to change. Without `webpack-theme-resolver-plugin` you'd need to create your ow implementation of `SimpleList` in order to be able to inject a different `ListEntry`. With this plugin you can simply create a `ListEntry` component which will then be used instead of the original one as long its path is the same and both components are imported using the same configurable `prefix` (see below).

Here an Example with vue and 2 local themes (it works with any file ending):

```
/sample-app
  - /components
    - /default-theme
      - /List
        - SimpleList.vue (js or other)
        - ListEntry.vue
    - /fancy-theme
      - /List
        - ListEntry.vue
```

## Installation
> **WARNING**: This package got renamed for version 4.1 from `webpack-theme-resolver-plugin` to `@russmedia/theme-resolver-webpack`

Install this plugin via npm alongside with [`webpack`](https://www.npmjs.com/package/webpack).
```bash
# for npm
npm install --save-dev @russmedia/theme-resolver-webpack

# or for yarn
yarn add -D @russmedia/theme-resolver-webpack
```

## Config
```js
// webpack.config.js

const path = require('path');
const ThemeResolverPlugin = require('@russmedia/theme-resolver-webpack')

module.exports = {
    ...
    resolve: {
        plugins: [
            new ThemeResolverPlugin(
                [
                    {
                        prefix: 'theme-components',
                        directories: [
                            path.resolve(__dirname, 'components/fancy-theme'),
                            path.resolve(__dirname, 'components/default-theme'),
                        ],
                        module: 'awesome-components',
                        singlePackage: true
                    }
                ]
            )
        ]
    }
};
```

| Option        | Required | Default | Description  |
| ------------- |:-------- |:------- | ------------ |
| prefix        |   yes    |         | Prefix for the import to trigger resolve |
| directories   |   yes    |         | The Directories to look through |
| module        |    no    |         | The Fallback Component to search for the component |
| singlePackage |    no    |  true   | Are all components in one package or one package per component |
| modulePath    |    no    |  /src   | The Path in the Module to look up |

The `directories` will be scanned in the order provided, falling back to `module` if no matching file is found.

In order to trigger the plugin the import statements need to be changed to include the set up `prefix`

```js
// will resolve to SimpleList.vue in components/default-theme/List/SimpleList.vue
import SimpleList from 'theme-components/components/List/SimpleList.vue'

// will resolve to ListEntry.vue in components/fancy-theme/List/ListEntry.vue
import ListEntry from 'theme-components/components/List/ListEntry.vue'
```

This way you can specify different configurations by having different `prefix` and `directories` set up.

## Example
Check out our Example made with Vue here [webpack-theme-resolver-plugin-example](https://github.com/russmediadigital/webpack-theme-resolver-plugin-example).

## Tests
To run the tests in this package follow this steps

1. Install plugin packages
```bash
npm i
```
2. Build the plugin
```bash
npm run build
```
3. Switch to the test-app
```bash
cd example/test-app
```
4. Install the test packages
```bash
npm i
```
5. Run the Test
```bash
npm run test
```

6. Results should be
```bash
Hello from Dir 1
Test from Dir 2
Goodbye from Dir 3
Hello from external package
```
