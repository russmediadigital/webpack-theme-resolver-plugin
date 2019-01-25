const Promise = require("bluebird");
const fs = require("fs");
const path = require("path");
const moduleresolver = require('resolve');

const existsAsync: (path: string) => Promise<boolean> = (path: string) => new Promise(
    (resolve: (result: boolean) => void) => {
        fs.exists(path, resolve);
    }
);

export interface IThemeResolverPluginOptions {
    directories?: string[];
    prefix?: string;
    module?: string;
    singlePackage?: boolean;
}

export class ThemeResolverPlugin {
    public static defaultOptions: IThemeResolverPluginOptions = {
        directories: [],
        prefix: "fallback",
        module: "",
        singlePackage: true,
    };

    private options: IThemeResolverPluginOptions[];
    private pathRegex: RegExp[];

    private cache: { [key: string]: Promise<string> };
    private choosenResolver: IThemeResolverPluginOptions;

    public constructor(options: IThemeResolverPluginOptions[]) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach(res => {
            this.pathRegex.push(new RegExp(`^${res.prefix}/`));
        });
        this.cache = {};
        this.choosenResolver = {};
    }

    public apply(resolver: any) {
        const target = resolver.ensureHook("module");
        resolver.hooks.module.tapAsync("ThemeResolverPlugin", (request: any, resolveContext: any, callback: () => void) => {
            this.pathRegex.forEach((reg, x) => {
                if (request.request.match(reg)) {
                    this.choosenResolver = Object.assign(ThemeResolverPlugin.defaultOptions, this.options[x]);
                }
            });
            if (Object.keys(this.choosenResolver).length) {
                const req = request.request.replace(new RegExp(`^${this.choosenResolver.prefix}/`), "");
                this.resolveComponentPath(req).then(
                    (resolvedComponentPath: string) => {
                        const obj = {
                            directory: request.directory,
                            path: request.path,
                            query: request.query,
                            request: resolvedComponentPath,
                        };
                        resolver.doResolve("resolve", obj, `resolve ${request.request} to ${resolvedComponentPath}`, callback);
                    },
                    () => {
                        this.resolveComponentModule(req).then(
                            (resolvedComponentModulePath: string) => {
                                const obj = {
                                    directory: request.directory,
                                    path: request.path,
                                    query: request.query,
                                    request: resolvedComponentModulePath,
                                };
                                resolver.doResolve("resolve", obj, `resolve ${request.request} to ${resolvedComponentModulePath}`, callback);
                            },
                            () => {
                                callback();
                            }
                        );
                    },
                );
                
                
            } else {
                callback();
            }
        });
    }

    public resolveComponentPath(reqPath: string): Promise<string> {
        if (!this.cache[reqPath]) {
            if (this.choosenResolver.directories) {
                this.cache[reqPath] = Promise.filter(
                    this.choosenResolver.directories.map((dir: string) => path.resolve(path.resolve(dir), reqPath)),
                    (item: string) => existsAsync(item).then((exists: boolean) => exists).catch(() => false),
                ).any();
            } else {
                this.cache[reqPath] = Promise.reject("No Fallback directories!");
            }
        }
        return this.cache[reqPath];
    }

    public resolveComponentModule(reqPath: string): Promise<string> {
        if (this.choosenResolver.module) {
            if (this.choosenResolver.singlePackage) {
                let tempReqPath = 'node_modules/' + this.choosenResolver.module + '/src/' + reqPath;
                this.cache[reqPath] = new Promise(
                    function (resolve: any, reject: any) {
                        try {
                            let res =  path.resolve(process.cwd(), tempReqPath)
                            if (res) {
                                resolve(res);
                            }
                            } catch(e) {
                            reject("Module is not resolvable");
                            }
                    }
                )
            } else {
                let dep = this.choosenResolver.module + '.' + reqPath.split('.')[0];
                this.cache[reqPath] = new Promise(
                    function (resolve: any, reject: any) {
                        try {
                            let res = moduleresolver.sync(dep, {basedir: process.cwd()});
                            if (res) {
                                resolve(res);
                            }
                            } catch(e) {
                            reject("Module is not resolvable");
                            }
                    }
                )
            }
            
            
        } else {
            this.cache[reqPath] = Promise.reject("No Fallback Module defined");
        }
        return this.cache[reqPath];
    }
}

module.exports = ThemeResolverPlugin;
