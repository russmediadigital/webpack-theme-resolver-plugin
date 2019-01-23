"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const moduleresolver = require('resolve');
const existsAsync = (path) => new Promise((resolve) => {
    fs.exists(path, resolve);
});
class FallbackResolverPlugin {
    constructor(options) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach(res => {
            this.pathRegex.push(new RegExp(`^#${res.prefix}#/`));
        });
        this.cache = {};
        this.choosenResolver = {};
    }
    apply(resolver) {
        const target = resolver.ensureHook("module");
        resolver.hooks.module.tapAsync("MyResolverPlugin", (request, resolveContext, callback) => {
            this.pathRegex.forEach((reg, x) => {
                if (request.request.match(reg)) {
                    this.choosenResolver = Object.assign(FallbackResolverPlugin.defaultOptions, this.options[x]);
                }
            });
            if (Object.keys(this.choosenResolver).length) {
                const req = request.request.replace(new RegExp(`^#${this.choosenResolver.prefix}#/`), "");
                this.resolveComponentPath(req).then((resolvedComponentPath) => {
                    const obj = {
                        directory: request.directory,
                        path: request.path,
                        query: request.query,
                        request: resolvedComponentPath,
                    };
                    resolver.doResolve("resolve", obj, `resolve ${request.request} to ${resolvedComponentPath}`, callback);
                }, () => {
                    this.resolveComponentModule(req).then((resolvedComponentModulePath) => {
                        const obj = {
                            directory: request.directory,
                            path: request.path,
                            query: request.query,
                            request: resolvedComponentModulePath,
                        };
                        resolver.doResolve("resolve", obj, `resolve ${request.request} to ${resolvedComponentModulePath}`, callback);
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
            if (this.choosenResolver.directories) {
                this.cache[reqPath] = Promise.filter(this.choosenResolver.directories.map((dir) => path.resolve(path.resolve(dir), reqPath)), (item) => existsAsync(item).then((exists) => exists).catch(() => false)).any();
            }
            else {
                this.cache[reqPath] = Promise.reject("No Fallback directories!");
            }
        }
        return this.cache[reqPath];
    }
    resolveComponentModule(reqPath) {
        if (this.choosenResolver.module) {
            if (this.choosenResolver.singlePackage) {
                let tempReqPath = 'node_modules/' + this.choosenResolver.module + '/src/' + reqPath;
                this.cache[reqPath] = new Promise(function (resolve, reject) {
                    try {
                        let res = path.resolve(process.cwd(), tempReqPath);
                        console.log(res);
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
                let dep = this.choosenResolver.module + '.' + reqPath.split('.')[0];
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
FallbackResolverPlugin.defaultOptions = {
    directories: [],
    prefix: "fallback",
    module: "",
    singlePackage: true,
};
exports.FallbackResolverPlugin = FallbackResolverPlugin;
module.exports = FallbackResolverPlugin;
