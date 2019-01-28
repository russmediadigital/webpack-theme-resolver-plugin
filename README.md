# webpack-theme-resolver-plugin
>Webpack Theme Resolver plugin to resolve files through a directory chain with a package fallback at compile time.  
For Webpack 4+

Based on the [`fallback-directory-resolver-plugin`](https://github.com/kije/webpack-fallback-directory-resolver-plugin) from kije

## Description
This is a Resolver-Plugin for webpack. It enables resolving files by looking up multiple directories in a chain with an fallback package. So for example you got a default-theme list component which got a ListEntry Component and you only want to overwrite the ListEntry Component in a new theme. Or the list component is part of an own component library, you can easily overwrite his child components from the local project.

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
Install this plugin via npm alongside with [`webpack`](https://www.npmjs.com/package/webpack).
```bash
npm install --save-dev webpack-theme-resolver-plugin
```

## Config
```js
// webpack.config.js

const path = require('path');
const ThemeResolverPlugin = require('webpack-theme-resolver-plugin')

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