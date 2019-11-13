export interface IThemeResolverPluginOptions {
    directories: string[];
    prefix: string;
}
export declare class ThemeResolverPlugin {
    static defaultOptions: IThemeResolverPluginOptions;
    private options;
    private pathRegex;
    private cache;
    constructor(options: IThemeResolverPluginOptions[]);
    apply(resolver: any): void;
    resolveComponentPath(reqPath: string, directories: string[]): string | undefined;
    private getResolver;
}
