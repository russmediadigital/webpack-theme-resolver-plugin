export interface IFallbackResolverPluginOptions {
    directories?: string[];
    prefix?: string;
    module?: string;
    singlePackage?: boolean;
}
export declare class FallbackResolverPlugin {
    static defaultOptions: IFallbackResolverPluginOptions;
    private options;
    private pathRegex;
    private cache;
    private choosenResolver;
    constructor(options: IFallbackResolverPluginOptions[]);
    apply(resolver: any): void;
    resolveComponentPath(reqPath: string): Promise<string>;
    resolveComponentModule(reqPath: string): Promise<string>;
}
