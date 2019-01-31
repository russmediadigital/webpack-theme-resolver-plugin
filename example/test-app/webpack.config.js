const ThemeResolverPlugin = require('../../dist/index');
const path = require('path');

module.exports = {
    context: __dirname,
    entry: "./js/script.js",
    mode: "development",
    output: {
        path: __dirname + "/dist",
        filename: "script.js"
    },
    resolve: {
        plugins: [
            new ThemeResolverPlugin(
                [
                    {
                        prefix: 'example-components',
                        directories: [
                            path.resolve(__dirname, 'js/dir2'),
                            path.resolve(__dirname, 'js/dir1')
                        ],
                        module: 'test-components',
                        singlePackage: true,
                        modulePath: '/src2'
                    },
                    {
                        prefix: 'second-comp-package',
                        directories: [
                            path.resolve(__dirname, 'js/dir3'),
                            path.resolve(__dirname, 'js/dir2')
                        ],
                        module: 'test-components',
                        singlePackage: true
                    }
                ]
            )
        ]
    }
};