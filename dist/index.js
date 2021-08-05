"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeResolverPlugin = void 0;
const path = require("path");
const theme_resolver_1 = require("@russmedia/theme-resolver");
class ThemeResolverPlugin {
    constructor(options) {
        this.resolver = new theme_resolver_1.ThemeResolver(options);
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
}
exports.ThemeResolverPlugin = ThemeResolverPlugin;
module.exports = ThemeResolverPlugin;
