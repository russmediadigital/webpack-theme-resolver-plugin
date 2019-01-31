export interface IThemeResolverPluginOptions {
    directories?: string[];
    prefix?: string;
    module?: string;
    singlePackage?: boolean;
    modulePath?: string;
}
export declare class ThemeResolverPlugin {
    static defaultOptions: IThemeResolverPluginOptions;
    private options;
    private pathRegex;
    private cache;
    private chosenResolver;
    constructor(options: IThemeResolverPluginOptions[]);
    apply(resolver: any): void;
    resolveComponentPath(reqPath: string): Promise<string>;
    resolveComponentModule(reqPath: string): Promise<string>;
}
