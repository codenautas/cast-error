export declare type Constructor<T> = new (...args: any[]) => T;
export declare class SystemError extends Error {
    code?: string;
    cause?: Error;
    constructor(message: string);
}
export declare function setLogFunction(f: typeof console.error): void;
export declare function expected<T extends Error = SystemError>(err: unknown, constructor?: Constructor<T>): T;
export declare function unexpected<T extends Error = SystemError>(err: unknown, constructor?: Constructor<T>): T;
