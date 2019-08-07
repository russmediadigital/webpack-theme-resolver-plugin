"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const moduleresolver = require('resolve');
const existsAsync = (path) => new Promise((resolve) => {
    fs.exists(path, resolve);
});
class ThemeResolverPlugin {
    constructor(options) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach(res => {
            this.pathRegex.push(new RegExp(`^${res.prefix}/`));
        });
        this.cache = {};
        this.chosenResolver = {};
    }
    apply(resolver) {
        resolver.typ;
        const target = resolver.ensureHook("module");
        resolver.hooks.module.tapAsync("ThemeResolverPlugin", (request, resolveContext, callback) => {
            this.pathRegex.forEach((reg, x) => {
                if (request.request.match(reg)) {
                    this.chosenResolver = Object.assign(ThemeResolverPlugin.defaultOptions, this.options[x]);
                }
            });
            if (Object.keys(this.chosenResolver).length) {
                const req = request.request.replace(new RegExp(`^${this.chosenResolver.prefix}/`), "");
                this.resolveComponentPath(req).then((resolvedComponentPath) => {
                    const obj = {
                        directory: request.directory,
                        path: request.path,
                        query: request.query,
                        request: resolvedComponentPath,
                    };
                    resolver.doResolve(resolver.hooks.resolve, obj, `resolve ${request.request} to ${resolvedComponentPath}`, resolveContext, callback);
                }, () => {
                    this.resolveComponentModule(req).then((resolvedComponentModulePath) => {
                        const obj = {
                            directory: request.directory,
                            path: request.path,
                            query: request.query,
                            request: resolvedComponentModulePath,
                        };
                        resolver.doResolve(resolver.hooks.resolve, obj, `resolve ${request.request} to ${resolvedComponentModulePath}`, resolveContext, callback);
                    }, () => {
                        callback();
                    });
                });
            }
            else {
                callback();
            }
        });
    }
    resolveComponentPath(reqPath) {
        if (!this.cache[reqPath]) {
            if (this.chosenResolver.directories) {
                this.cache[reqPath] = Promise.filter(this.chosenResolver.directories.map((dir) => path.resolve(path.resolve(dir), reqPath)), (item) => existsAsync(item).then((exists) => exists).catch(() => false)).any();
            }
            else {
                this.cache[reqPath] = Promise.reject("No Fallback directories!");
            }
        }
        return this.cache[reqPath];
    }
    resolveComponentModule(reqPath) {
        if (this.chosenResolver.module) {
            if (this.chosenResolver.singlePackage) {
                let tempReqPath = 'node_modules/' + this.chosenResolver.module + this.chosenResolver.modulePath + '/' + reqPath;
                this.cache[reqPath] = new Promise(function (resolve, reject) {
                    try {
                        let res = path.resolve(process.cwd(), tempReqPath);
                        if (res) {
                            resolve(res);
                        }
                    }
                    catch (e) {
                        reject("Module is not resolvable");
                    }
                });
            }
            else {
                let dep = this.chosenResolver.module + '.' + reqPath.split('.')[0];
                this.cache[reqPath] = new Promise(function (resolve, reject) {
                    try {
                        let res = moduleresolver.sync(dep, { basedir: process.cwd() });
                        if (res) {
                            resolve(res);
                        }
                    }
                    catch (e) {
                        reject("Module is not resolvable");
                    }
                });
            }
        }
        else {
            this.cache[reqPath] = Promise.reject("No Fallback Module defined");
        }
        return this.cache[reqPath];
    }
}
ThemeResolverPlugin.defaultOptions = {
    directories: [],
    prefix: "fallback",
    module: "",
    singlePackage: true,
    modulePath: "/src"
};
exports.ThemeResolverPlugin = ThemeResolverPlugin;
module.exports = ThemeResolverPlugin;
