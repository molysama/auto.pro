export interface Option {
    ui?: string[];
    encode?: {
        key: string;
        exclude?: string[];
    };
}
export declare class AutoProWebpackPlugin {
    option: Option;
    constructor(option: Option);
    apply(compiler: any): void;
}
