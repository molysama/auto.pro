export declare function checkUpdate({ validFunction, updateFunction, shopUrl }?: {
    validFunction?: (() => false) | undefined;
    updateFunction?: (() => void) | undefined;
    shopUrl?: string | undefined;
}): void;
