export declare type Constructor<T> = new (...args: any[]) => T;
export declare class ExtendedError extends Error {
    code: string;
    constructor(message: string);
}
export declare function expected<T extends Error = ExtendedError>(err: unknown, constructor?: Constructor<T>): T;
export declare function unexpected<T extends Error = ExtendedError>(err: unknown, constructor?: Constructor<T>): T;
