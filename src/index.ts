import * as path from "path";
import {ThemeResolver, ThemeResolverOptions} from '@russmedia/theme-resolver'

export { ThemeResolverOptions as IThemeResolverPluginOptions }

export class ThemeResolverPlugin {
    private resolver: ThemeResolver;

    public constructor(options: ThemeResolverOptions[]) {
        this.resolver = new ThemeResolver(options)
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
}

module.exports = ThemeResolverPlugin;
