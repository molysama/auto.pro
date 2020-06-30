export interface Option {
    ui?: string[];
    encode?: {
        key: string;
    };
}
export declare class AutoProWebpackPlugin {
    option: Option;
    constructor(option: {
        ui?: string[];
        encode?: {
            key: string;
        };
    });
    apply(compiler: any): void;
}
