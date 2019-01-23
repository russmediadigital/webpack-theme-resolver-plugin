const FallbackDirectoryResolverPlugin = require('../dist/index');
const path = require('path');

module.exports = {
    context: __dirname,
    entry: "./js/script.js",
    output: {
        path: __dirname + "/dist",
        filename: "script2.js"
    },
    resolve: {
        plugins: [
            new FallbackDirectoryResolverPlugin(
                [
                    {
                        prefix: 'test-fallback',
                        directories: [
                            path.resolve(__dirname, 'js/dir2'),
                            path.resolve(__dirname, 'js/dir1')
                        ],
                        module: 'webpack-testing-example-comp'
                    },
                ]
            )
        ]
    }
};