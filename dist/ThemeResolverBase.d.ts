import { IThemeResolverPluginOptions } from ".";
export declare class ThemeResolverBase {
    private pathRegex;
    private options;
    static defaultOptions: IThemeResolverPluginOptions;
    private cache;
    constructor(pathRegex: RegExp[], options: IThemeResolverPluginOptions[]);
    resolveComponentPath(reqPath: string, directories: string[]): string | undefined;
    getResolver(request: string): IThemeResolverPluginOptions | void;
    getFileName(fullPathName: string, resolver: IThemeResolverPluginOptions): string;
}
