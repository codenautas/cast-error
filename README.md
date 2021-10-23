# cast-error

cast Error for use in TypeScript in catch clausule


![stable](https://img.shields.io/badge/stability-stable-blue.svg)
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

Have handy way to receive typed Errors y _Typescript_.

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


```ts
try{
    somethingCanGoWrong();
}catch(err){
    console.error(err.message || err.toString());
    throw err;
}

try{
    await fsPromise.unlink('/tmp/aFile.txt');
}catch(err){
    // @ts-ignore
    if(err.code!='ENOENT') throw err;
}
```


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


## License


[MIT](LICENSE)
