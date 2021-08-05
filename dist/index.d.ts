export interface IThemeResolverPluginOptions {
    directories: string[];
    prefix: string;
}
export declare class ThemeResolverPlugin {
    static defaultOptions: IThemeResolverPluginOptions;
    private options;
    private pathRegex;
    private resolver;
    constructor(options: IThemeResolverPluginOptions[]);
    apply(resolver: any): void;
    postcssResolve(id: string, baseDir: string, importOptions: any): string;
}
