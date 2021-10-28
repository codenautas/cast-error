export type Constructor<T> = new(...args: any[]) => T;

export class SystemError extends Error{
    code?:string
    cause?:Error
    constructor(message:string) {
        super(message)
        this.name = 'SystemError';
    }
}

var logFunction = console.error;

export function setLogFunction(f:typeof console.error){
    logFunction = f;
}

export function expected<T extends Error = SystemError>(err:unknown, constructor?:Constructor<T>):T{
    if(err instanceof Error){ 
        if(constructor != null && !(err instanceof constructor)) logFunction(`not a "${constructor.name}" in a catch:`,err);
        return err as T;
    }
    logFunction('not an Error in a catch',err);
    var message:string = err == null ? "null error in catch" : ( 
        typeof err == "string" ? err : (
            // @ts-ignore
            typeof err == "object" && "message" in err ? err.message : err
        )
    ).toString();
    // @ts-ignore
    return new (constructor||Error)(message);
}

export function unexpected<T extends Error = SystemError>(err:unknown, constructor?:Constructor<T>):T{
    logFunction('unexpectedError',err);
    return expected(err, constructor);
}
