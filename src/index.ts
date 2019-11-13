import * as fs from "fs";
import * as path from "path";

export interface IThemeResolverPluginOptions {
    directories: string[];
    prefix: string;
}

export class ThemeResolverPlugin {
    public static defaultOptions: IThemeResolverPluginOptions = {
        directories: [],
        prefix: "fallback",
    };

    private options: IThemeResolverPluginOptions[];
    private pathRegex: RegExp[];

    private cache: { [key: string]: string | undefined };

    public constructor(options: IThemeResolverPluginOptions[]) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach((res) => {
            this.pathRegex.push(new RegExp(`^${res.prefix}/`));
        });
        this.cache = {};
    }

    public apply(resolver: any) {
        const target = resolver.ensureHook("resolved");

        resolver.getHook("module")
        .tapAsync("ThemeResolverPlugin", (request: any, resolveContext: any, callback: () => void) => {
                let chosenResolver = this.getResolver(request);

                if (chosenResolver) {
                    const req = request.request.replace(new RegExp(`^${chosenResolver.prefix}/`), "");
                    const resolvedPath = this.resolveComponentPath(req, chosenResolver.directories)

                    if (!resolvedPath) {
                        return callback()
                    }

                    const obj = Object.assign({}, request, {
                        path: resolvedPath,
                    })

                    resolver.doResolve(
                        target,
                        obj,
                        `resolve ${request.request} to ${resolvedPath}`,
                        resolveContext,
                        callback,
                    );
                } else {
                    callback();
                }
            },
        );
    }

    public resolveComponentPath(reqPath: string, directories: string[]): string | undefined {

        if (this.cache[reqPath] !== undefined) {
            return this.cache[reqPath]
        }

        const dirs = directories.map((dir: string) => path.resolve(path.resolve(dir), reqPath))

        const resolvedPath = dirs.find((path: string) => fs.existsSync(path))

        if (resolvedPath) {
            this.cache[reqPath] = resolvedPath
        }

        return this.cache[reqPath]
    }

    private getResolver(request: any): IThemeResolverPluginOptions | void
    {
        let resolver;

        this.pathRegex.forEach((reg, x) => {
            if (request.request.match(reg)) {
                resolver = Object.assign({}, ThemeResolverPlugin.defaultOptions, this.options[x]);
            }
        });

        return resolver
    }
}

module.exports = ThemeResolverPlugin;
