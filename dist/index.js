"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeResolverPlugin = void 0;
const fs = require("fs");
const path = require("path");
class ThemeResolverPlugin {
    constructor(options) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach((res) => {
            this.pathRegex.push(new RegExp(`^${res.prefix}/`));
        });
        this.cache = {};
    }
    apply(resolver) {
        const target = resolver.ensureHook("resolved");
        resolver.getHook("module")
            .tapAsync("ThemeResolverPlugin", (request, resolveContext, callback) => {
            const chosenResolver = this.getResolver(request);
            if (chosenResolver) {
                const req = request.request.replace(new RegExp(`^${chosenResolver.prefix}/`), "");
                const ext = path.extname(req);
                const tryFiles = [];
                if (ext === '') {
                    ['ts'].map(ext => tryFiles.push(req + '.' + ext));
                }
                tryFiles.push(req);
                let resolvedPath;
                tryFiles.some(filePath => {
                    const result = this.resolveComponentPath(filePath, chosenResolver.directories);
                    if (result && result !== request.context.issuer) {
                        resolvedPath = result;
                        return true;
                    }
                    return false;
                });
                if (!resolvedPath) {
                    return callback();
                }
                const obj = Object.assign({}, request, {
                    path: resolvedPath,
                });
                resolver.doResolve(target, obj, `resolve ${request.request} to ${resolvedPath}`, resolveContext, callback);
            }
            else {
                callback();
            }
        });
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
            if (request.request.match(reg)) {
                resolver = Object.assign({}, ThemeResolverPlugin.defaultOptions, this.options[x]);
            }
        });
        return resolver;
    }
}
exports.ThemeResolverPlugin = ThemeResolverPlugin;
ThemeResolverPlugin.defaultOptions = {
    directories: [],
    prefix: "fallback",
};
module.exports = ThemeResolverPlugin;
