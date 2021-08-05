import { ThemeResolverOptions } from '@russmedia/theme-resolver';
export { ThemeResolverOptions as IThemeResolverPluginOptions };
export declare class ThemeResolverPlugin {
    private resolver;
    constructor(options: ThemeResolverOptions[]);
    apply(resolver: any): void;
}
