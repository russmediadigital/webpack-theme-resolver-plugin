import * as fs from "fs";
import * as path from "path";
import { IThemeResolverPluginOptions } from ".";
export class ThemeResolverBase {
    public static defaultOptions: IThemeResolverPluginOptions = {
        directories: [],
        prefix: "fallback",
    };
    private cache: { [key: string]: string | undefined } = {};

    public constructor(private pathRegex: RegExp[], private options: IThemeResolverPluginOptions[]) {}

    // Get Component (reqPath) from directories passed into the function. First File found will be returned
    public resolveComponentPath(reqPath: string, directories: string[]): string | undefined {

        if (this.cache[reqPath] !== undefined) {
            return this.cache[reqPath];
        }

        const dirs = directories.map((dir: string) => path.resolve(path.resolve(dir), reqPath));

        const resolvedPath = dirs.find((pathName: string) => fs.existsSync(pathName));

        if (resolvedPath) {
            this.cache[reqPath] = resolvedPath;
        }

        return this.cache[reqPath];
    }

    // Get Options to resolve the correct File
    public getResolver(request: string): IThemeResolverPluginOptions | void {
        let resolver;

        this.pathRegex.forEach((reg, x) => {
            if (request.match(reg)) {
                resolver = Object.assign({}, ThemeResolverBase.defaultOptions, this.options[x]);
            }
        });

        return resolver;
    }

    // Get File name without alias at the start of the full Path Name
    public getFileName(fullPathName: string, resolver: IThemeResolverPluginOptions): string {
        return fullPathName.replace(new RegExp(`^${resolver.prefix}/`), "");
    }
}

module.exports = ThemeResolverBase;
