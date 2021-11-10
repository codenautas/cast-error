# cast-error

cast Error for use in TypeScript in catch clausule


![red](https://img.shields.io/badge/stability-designing-red.svg)
[![npm-version](https://img.shields.io/npm/v/cast-error.svg)](https://npmjs.org/package/cast-error)
[![downloads](https://img.shields.io/npm/dm/cast-error.svg)](https://npmjs.org/package/cast-error)
[![build](https://github.com/codenautas/cast-error/actions/workflows/node.js.yml/badge.svg)](https://github.com/codenautas/cast-error/actions/workflows/node.js.yml)
[![coverage](https://img.shields.io/coveralls/codenautas/cast-error/master.svg)](https://coveralls.io/r/codenautas/cast-error)
[![outdated-deps](https://img.shields.io/github/issues-search/codenautas/cast-error?color=9cf&label=outdated-deps&query=is%3Apr%20author%3Aapp%2Fdependabot%20is%3Aopen)](https://github.com/codenautas/cast-error/pulls/app%2Fdependabot)


language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)


## Install


```sh
$ npm install cast-error
```


## Main goal

The main goal is to have handy way to receive typed Errors y _Typescript_.

In one hand in _Typescript_ when you use `catch(err)` the variable
`err` is of type `unkown` (formerly `any`). Thats why you cannot
write `err.code` for `SystemErrors` (formerly you can but `tsc`
did not warn you if you make a typo like `err.code_num`)

In the other hand in _Javascript_ you can throw any varialbe
regardles of its type. You can even throw `null`. Then it is'n
safe to write `err.message`.

With **cast-error** this problems are solved in a fancy and eficient
way.

Instead of writing this:


![try{ somethingCanGoWrong(); }catch(err){ console.error(err.message || err.toString()); throw err; } try{ await fsPromise.unlink('/tmp/aFile.txt'); }catch(err){ if(err.code!='ENOENT') throw err; }](doc/catchjs.png)


with **cast-error** you can write:



```ts
try{
    somethingCanGoWrong();
}catch(err){
    var error = castError.unexpected(err); // implicit console.err because is unexpected
    throw err;
}

try{
    await fsPromise.unlink('/tmp/aFile.txt');
}catch(err){
    var error = castError.expected(err)
    if(error.code!='ENOENT') throw err;  // code exists in error because is a SystemError
}
```


# Getting deep


## Use cases

The main use cases of `try/catch` are:

   1. To register unexpeted error conditions in a way that the programmers
   can later identify and correct the bug.
   2. To warn the users that there is a problem with their input data.
   3. To handle an exceptional and recoverable situation.


### Case 1: loggin unexpected errors

It is posible to hook and centralize the way to log error in every `catch`
setting the log function with `setLogFunction` and then call `unexpected`
in the main cycle and in all points where special behaviour is needed.


```ts

function initializeSystem(){
    //... other inits...
    var attributes = {code:true,err_num:true,cause:true};
    type MyGlobalError = Error & {[k in keyof typeof attributes]: any}
    castError.setLogFunction(function(context:string, error:MyGlobalError){
        console.log('***********',context);
        var attr: keyof typeof attributes;
        for(attr in attributes){
            console.log(attr,':',error[attr])
        }
    })
}

// In  the main cycle
catch(err){
    throw castError.unexpected(err);
}

// In a function with special needs:
function getStream(name:string){
    try{
        const fd = await fs.open(name)
        var stream = fd.createReadStream()
        this.decorateStream(stream);
        return stream;
    }catch(err){
        var error = unexpected(err)
        console.log('opening stream',name,'in',this.context(error));
        throw error;
    }
}

```


### Case 2: Warning users that there is a problem with their input data.

In some cases we need to warn users if there ara problemas with their input data.
For example if the user wants to delete a file, and the system doesn't find the file it must warn the user.

In Node.js `fs.exists` is deprecated. In the [documentation](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsexistspath-callback)
is clear that the way is to use the file and capture the error to know if
the file was not found:


```ts
import * as fs from 'fs/promises';
import {expected} from 'cast-error';

function openFileAndProcess(filename:string){
    try{
        var stream = fs.createReadStream(filename)
        var result = process(stream);
        return result;
    }catch(err){
        var error = expected(err);
        if(error.code=='ENOENT'){
            return {
                ok:false,
                message:'file not found'
            }
        }
        throw error;
    }
}
```


There are many cavets to observ:
   1. If the system is a tipical web aplication is razonable to think that
   there is a table with te names of the files that can be delete by the user.
   If opening (or deleting) a file that is supouse to exists, any error is
   an unexpected error. And, because of that, is part of the Case 1.
   2. Not all programs are the tipical web application. A program can be
   a command line one or an administration web application. In these cases
   the _file table_ may be not exists.
   3. In any case, if it is a web application is mandatory to take care of
   attackers. So in the error messages the system should'n send more
   information that what the user can know.
   4. If there no validations to a white list there be other validations:
   the folder, the type of file (or its extension), and the logical ownership of the file.


### Caso 3: To handle an exceptional and recoverable situation.

_[... in progress ...]_




# Deepening

## Typesystem


```ts
```


## License


[MIT](LICENSE)
