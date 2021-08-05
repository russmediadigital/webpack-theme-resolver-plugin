import { ThemeResolverOptions } from '@russmedia/theme-resolver';
export interface IThemeResolverPluginOptions extends ThemeResolverOptions {
}
export declare class ThemeResolverPlugin {
    private resolver;
    constructor(options: ThemeResolverOptions[]);
    apply(resolver: any): void;
}
