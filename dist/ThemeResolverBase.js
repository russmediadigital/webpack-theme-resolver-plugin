"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeResolverBase = void 0;
const fs = require("fs");
const path = require("path");
class ThemeResolverBase {
    constructor(pathRegex, options) {
        this.pathRegex = pathRegex;
        this.options = options;
        this.cache = {};
    }
    resolveComponentPath(reqPath, directories) {
        if (this.cache[reqPath] !== undefined) {
            return this.cache[reqPath];
        }
        const dirs = directories.map((dir) => path.resolve(path.resolve(dir), reqPath));
        const resolvedPath = dirs.find((pathName) => fs.existsSync(pathName));
        if (resolvedPath) {
            this.cache[reqPath] = resolvedPath;
        }
        return this.cache[reqPath];
    }
    getResolver(request) {
        let resolver;
        this.pathRegex.forEach((reg, x) => {
            if (request.match(reg)) {
                resolver = Object.assign({}, ThemeResolverBase.defaultOptions, this.options[x]);
            }
        });
        return resolver;
    }
    getFileName(fullPathName, resolver) {
        return fullPathName.replace(new RegExp(`^${resolver.prefix}/`), "");
    }
}
exports.ThemeResolverBase = ThemeResolverBase;
ThemeResolverBase.defaultOptions = {
    directories: [],
    prefix: "fallback",
};
module.exports = ThemeResolverBase;
