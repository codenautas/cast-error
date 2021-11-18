<!--multilang v0 es:LEEME.md en:README.md -->
# cast-error
<!--lang:es-->

uso de catch con errores fuertemente tipados

<!--lang:en--]

cast Error for use in TypeScript in catch clause

[!--lang:*-->

<!-- cucardas -->
![stability](https://img.shields.io/badge/stability-extending-orange.svg)
[![npm-version](https://img.shields.io/npm/v/cast-error.svg)](https://npmjs.org/package/cast-error)
[![downloads](https://img.shields.io/npm/dm/cast-error.svg)](https://npmjs.org/package/cast-error)
[![build](https://github.com/codenautas/cast-error/actions/workflows/node.js.yml/badge.svg)](https://github.com/codenautas/cast-error/actions/workflows/node.js.yml)
[![coverage](https://img.shields.io/coveralls/codenautas/cast-error/master.svg)](https://coveralls.io/r/codenautas/cast-error)
[![outdated-deps](https://img.shields.io/github/issues-search/codenautas/cast-error?color=9cf&label=outdated-deps&query=is%3Apr%20author%3Aapp%2Fdependabot%20is%3Aopen)](https://github.com/codenautas/cast-error/pulls/app%2Fdependabot)

<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)

<!--lang:es-->

## Instalación

<!--lang:en--]

## Install

[!--lang:*-->

```sh
$ npm install cast-error
```

<!--lang:es-->

## Objetivo principal

Tener un mecanismo en _Typescript_ que reciba errores tipados. 

Por un lado en _Typescript_ la forma `catch(err)` implica que `err` 
es o bien de tipo `unknown` (comprtamiento actual) o bien de tipo `any`
(comportamiento anterior). Eso hace que o bien no se puede escribir
`err.code` o bien no detecta el error de tipeo al escribir `err.code_num`.

Por otro lado en _Javascript_ se puede hacer throw de una variable
cualquiera (aunque no sea un objeto de la clase Error), incluso se puede
hacer `throw null`. Entonces no es seguro escribir `err.message`. 

Con **cast-error** se solucionan ambos problemas de una manera cómoda,
elegante y eficiente:

En vez de escribir:

<!--lang:en--]

## Main goal

The main goal is to have handy way to receive typed Errors y _Typescript_.

In one hand in _Typescript_ when you use `catch(err)` the variable
`err` is of type `unknown` (formerly `any`). That's why you cannot 
write `err.code` for `SystemErrors` (formerly you can but `tsc`
did not warn you if you make a typo like `err.code_num`)

In the other hand in _Javascript_ you can throw any variable 
regardless of its type. You can even throw `null`. Then it isn't
safe to write `err.message`.

With **cast-error** this problems are solved in a fancy and efficient
way.

Instead of writing this:

[!--lang:*-->

![try{ somethingCanGoWrong(); }catch(err){ console.error(err.message || err.toString()); throw err; } try{ await fsPromise.unlink('/tmp/aFile.txt'); }catch(err){ if(err.code!='ENOENT') throw err; }](doc/catchjs.png)

<!--lang:es-->

con **cast-error** eso se puede escribir así: 

<!--lang:en--]

with **cast-error** you can write:

[!--lang:*-->

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

<!--lang:es-->

# Profundizando

<!--lang:en--]

# Getting deep

[!--lang:es-->

## Los casos de uso

Los casos de uso principales de `try/catch` son:

   1. Dejar un registro de un error inesperado del sistema para que luego
   un programador identifique el problema y corrija el sistema.
   2. Avisarle al usuario de un problema con sus datos de entrada. 
   3. Manejar una situación excepcional pero recuperable. 

<!--lang:en--]

## Use cases

The main use cases of `try/catch` are:

   1. To register unexpected error conditions in a way that the programmers
   can later identify and correct the bug.
   2. To warn the users that there is a problem with their input data.
   3. To handle an exceptional and recoverable situation.

[!--lang:es-->

### Caso 1: registro de errores inesperados

Normalmente debería haber un `try/catch` en el ciclo más externo del sistema
que registre todos los errores que no se hayan podido resolver para poder
investigarlos en el futuro (detectar posibles bugs, etc). 
Si el programa no es un servicio backend y es una herramienta tipo CLI
de un solo uso, el `try/catch` puede estar al final de todo. 
También podría usarse un `hook` de `node.js` (suponiendo que no está en el
navegador, donde de todos modos es difícil dejar registro de los errores).

A veces hay una función interna a la que queremos agregarle un `try/catch`
para que en caso de error, poder registrar el valor de ciertas variables
con las cuales obtener más contexto. No se debe olvidar de volver lanzar
el error `throw error` en esos casos para no fallar en silencio dentro
del programa principal. 

En estos casos se puede usar `castError.unexpected` junto a `castError.setLogginFucntion' para registrar el error donde ocurra:

<!--lang:en--]

### Case 1: logging unexpected errors

It is possible to hook and centralize the way to log error in every `catch`
setting the log function with `setLogFunction` and then call `unexpected`
in the main cycle and in all points where special behavior is needed.

[!--lang:*-->

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

<!--lang:es-->

### Caso 2: Avisarle al usuario de un problema con sus datos de entrada.

¿Qué pasa cuando un usuario necesita procesar un archivo que él previamente
almacenó? ¿Cómo contestar si ese archivo no se encuentra?

En principio falta contexto, ¿lo subió al servidor desde una página diseñada
para tal cosa? ¿o es un "comando" que se corre en la máquina y el nombre de
archivo lo pasaron como parámetro?. 

Si vamos a la documentación de [`fs.exists`](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsexistspath-callback) está declarada como
_deprecated_ diciendo no pregunte si existe, haga lo que tenga que hacer
con el archivo, que si no existe, le vamos a avisar con una excepción. 
Tan _deprecated_ está que no existe su versión en [`fs/promises`](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#file-system). 
Eso lo que significa es que hay que intentar hacer algo (ej: abrir el archivo) y estar atento a la posible excepción:

<!--lang:en--]

### Case 2: Warning users that there is a problem with their input data.

In some cases, we need to warn users if there are problemas with their input data. 
For example, if the user wants to delete a file, and the system doesn't find the file it must warn the user. 

In Node.js `fs.exists` is deprecated. In the [documentation](https://nodejs.org/dist/latest-v16.x/docs/api/fs.html#fsexistspath-callback) 
is clear that the way is to use the file and capture the error to know if
the file was not found: 

[!--lang:*-->

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

<!--lang:es-->

Hay varias cosas que se pueden observar:
   1. Si el archivo fue subido desde una típica aplicación web es razonable
   suponer que existe una base de datos donde haya una tabla con los nombres
   de los archivos subidos y es ahí donde se debería validar esto. 
   En este caso los errores del catch serían inesperados (_unexpectd_) 
   y deberían considearse en el caso 1.
   2. No todo es una típica aplicación web. El sistema podría ser una consola
   de administración del serivod (podría ser un comando para ejecutar
   directamente en la consola del sistema operativo o una aplicación
   web de administración del servidor): en esos casos tiene sentido pensar
   que podría no existir esa tabla. 
   3. Cualquiera sea el caso, si se trata de una aplicación web, hay que
   tener cuidado con la cantidad de información que se le da al usuario. 
   Hay que recordar que siempre en una aplicación web tenemos que contemplar
   la posibilidad de que el usuario sea un atacante, y no darle más 
   información que la que puede tener por los medios tradicionales. 
   4. Si se va a intentar abrir un archivo en forma directa (sin validar
   el nombre en una _whitelist_) hay que tener cuidado de no permitir
   abrir archivos que el usuario no debería ver (archivos de configuración, del sistema, de otras carpetas o de otros usuarios).

<!--lang:en--]

There are many caveats to observe:
   1. If the system is a typical web application is reasonable to think that
   there is a table with the names of the files that can be delete by the user. 
   If opening (or deleting) a file that is suppose to exists, any error is 
   an unexpected error. And, because of that, is part of the Case 1.
   2. Not all programs are the typical web application. A program can be
   a command line one or an administration web application. In these cases,
   the _file table_ may be not exists. 
   3. In any case if it is a web application is mandatory to take care of
   attackers. So in the error messages the system shouldn't send more 
   information that what the user can know.
   4. If there no validations to a whitelist there be other validations:
   the folder, the type of file (or its extension), and the logical ownership of the file. 

<!--lang:es-->

### Caso 3: Manejar una situación excepcional pero recuperable. 

_[... en proceso ...]_

<!--lang:en--]

### Caso 3: To handle an exceptional and recoverable situation.

_[... in progress ...]_


[!--lang:*-->

<!--lang:es-->

## Los tipos

En _Typescript_ no se puede especificar el tipo de la variable en `catch` 
(no más que `any` o `unkown`). 
Porque no hay manera de anticipar (con el _Typescript_ actual) de qué tipo
es el error que puede capturar un `try` (porque eso depende de las funciones
llamadas dentro del `try` y las que están dentro de esas y así). 

<!--lang:en--]

## Type system

[!--lang:*-->

```ts
```

<!--lang:es-->

## Licencia

<!--lang:en--]

## License

[!--lang:*-->

[MIT](LICENSE)
