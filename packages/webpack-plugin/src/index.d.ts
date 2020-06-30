export interface Option {
    ui?: string[];
    encode?: {
        key: string;
        type: 'pck7' | 'pck5';
    };
}
export declare class AutoProWebpackPlugin {
    option: Option;
    constructor(option: {
        ui?: string[];
        encode?: {
            key: string;
            type: 'pck7' | 'pck5';
        };
    });
    apply(compiler: any): void;
}
