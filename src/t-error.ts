export type Constructor<T> = new(...args: any[]) => T;

export class ExtendedError extends Error{
    code:string
    constructor(message:string) {
        super(message);
        this.name = 'ExtendedError';
        this.code = 'UNKNOWN';
    }
}

export function expected<T extends Error = ExtendedError>(err:unknown, constructor?:Constructor<T>):T{
    if(err instanceof Error) return err as T;
    console.error('not an Error in a catch',err);
    var message:string = err == null ? "null error in catch" : ( 
        typeof err == "string" ? err : (
            // @ts-ignore
            typeof err == "object" && "message" in err ? err.message : err
        )
    ).toString();
    // @ts-ignore
    return new (constructor||Error)(message);
}

export function unexpected<T extends Error = ExtendedError>(err:unknown, constructor?:Constructor<T>):T{
    console.error('unexpectedError',err);
    return expected(err, constructor);
}
