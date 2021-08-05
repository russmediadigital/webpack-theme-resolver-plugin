import * as path from "path";
import { ThemeResolverBase } from "./ThemeResolverBase"

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

    private resolver: ThemeResolverBase;

    public constructor(options: IThemeResolverPluginOptions[]) {
        this.options = options;
        this.pathRegex = [];
        this.options.forEach((res) => {
            this.pathRegex.push(new RegExp(`^${res.prefix}/`));
        });

        this.resolver = new ThemeResolverBase(this.pathRegex, this.options)
    }

    public apply(resolver: any /* EnhancedResolve.Resolver */) {
        const target = resolver.ensureHook("resolved");

        resolver
            .getHook("module")
            .tapAsync("ThemeResolverPlugin", (request: any, resolveContext: any, callback: () => void) => {
                const chosenResolver = this.resolver.getResolver(request.request);

                if (chosenResolver) {
                    const file = this.resolver.getFileName(request.request, chosenResolver)

                    const extension = path.extname(file)
                    const tryFiles = []

                    if (extension === '') {
                        ['ts'].map(ext => tryFiles.push(file + '.' + ext))
                    }

                    tryFiles.push(file)

                    let resolvedPath
                    tryFiles.some(filePath => {
                        const result = this.resolver.resolveComponentPath(filePath, chosenResolver.directories)

                        if (result && result !== request.context.issuer) {
                            resolvedPath = result
                            return true
                        }
                        return false
                    })

                    if (!resolvedPath) {
                        return callback();
                    }

                    const obj = Object.assign({}, request, {
                        path: resolvedPath,
                    });

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

    public postcssResolve(id: string, baseDir: string, importOptions: any) {
        const chosenResolver = this.resolver.getResolver(id);
        if (chosenResolver) {
            const file = this.resolver.getFileName(id, chosenResolver)

            const result = this.resolver.resolveComponentPath(file, chosenResolver.directories)

            if (!result) {
                return id
            }

            return result

        } else {
            return id
        }
    }
}

module.exports = ThemeResolverPlugin;
