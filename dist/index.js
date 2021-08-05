"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeResolverPlugin = void 0;
const path = require("path");
const ThemeResolverBase_1 = require("./ThemeResolverBase");
class ThemeResolverPlugin {
    constructor(options) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach((res) => {
            this.pathRegex.push(new RegExp(`^${res.prefix}/`));
        });
        this.resolver = new ThemeResolverBase_1.ThemeResolverBase(this.pathRegex, this.options);
    }
    apply(resolver) {
        const target = resolver.ensureHook("resolved");
        resolver
            .getHook("module")
            .tapAsync("ThemeResolverPlugin", (request, resolveContext, callback) => {
            const chosenResolver = this.resolver.getResolver(request.request);
            if (chosenResolver) {
                const file = this.resolver.getFileName(request.request, chosenResolver);
                const extension = path.extname(file);
                const tryFiles = [];
                if (extension === '') {
                    ['ts'].map(ext => tryFiles.push(file + '.' + ext));
                }
                tryFiles.push(file);
                let resolvedPath;
                tryFiles.some(filePath => {
                    const result = this.resolver.resolveComponentPath(filePath, chosenResolver.directories);
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
    postcssResolve(id, baseDir, importOptions) {
        const chosenResolver = this.resolver.getResolver(id);
        if (chosenResolver) {
            const file = this.resolver.getFileName(id, chosenResolver);
            const result = this.resolver.resolveComponentPath(file, chosenResolver.directories);
            if (!result) {
                return id;
            }
            return result;
        }
        else {
            return id;
        }
    }
}
exports.ThemeResolverPlugin = ThemeResolverPlugin;
ThemeResolverPlugin.defaultOptions = {
    directories: [],
    prefix: "fallback",
};
module.exports = ThemeResolverPlugin;
