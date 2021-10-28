import * as castError from "../lib/cast-error";
import * as assert from "assert";
import {promises as fs} from "fs";

describe("cast-error", function(){
    it("detects error type",async function(){
        try{
            await fs.readFile("non-existent.txt");
            assert(false, "problem in the design of test. non-existent.txt must do not exists")
        }catch(err){
            var error = castError.expected(err)
            assert.equal(error.code, "ENOENT")
        }
    })
    var theLog: any[] = [];
    before(()=>{
        castError.setLogFunction((...args:any[])=>theLog.push(args));
    })
    beforeEach(()=>{
        theLog = [];
    })
    it("warns unexpected error class", function(){
        try{
            // @ts-expect-error unexistent is not existent
            var x = unexistent.prop;
            assert(false, "problem in test. Reading prop of unexistent must throw error but get "+x)
        }catch(err){
            var error = castError.unexpected(err);
            assert.equal(error.name, "ReferenceError");
            assert.deepStrictEqual(theLog, [["unexpectedError", err]])
        }
    })
    it("warns about different error class", function(){
        try{
            // @ts-expect-error unexistent is not existent
            var x = unexistent.prop;
            assert(false, "problem in test. Reading prop of unexistent must throw error but get "+x)
        }catch(err){
            var error = castError.expected(err, TypeError);
            assert.equal(error.name, "ReferenceError");
            assert.deepStrictEqual(theLog, [["not a \"TypeError\" in a catch:", err]])
        }
    })
    it("warns about unexpected and different non error", function(){
        try{
            throw "message instead error";
            assert(false, "problem in test. throw must throw error but get ")
        }catch(err){
            var error = castError.unexpected(err);
            assert.equal(error.name, "Error");
            assert.equal(error.message, "message instead error");
            assert.deepStrictEqual(theLog, [["unexpectedError", err],["not an Error in a catch", err]])
        }
    })
    it("warns about null error", function(){
        try{
            throw null;
            assert(false, "problem in test. throw must throw error but get ")
        }catch(err){
            var error = castError.expected(err);
            assert.equal(error.name, "Error");
            assert.equal(error.message, "null error in catch");
            assert.deepStrictEqual(theLog, [["not an Error in a catch", err]])
        }
    })
    it("warns about duck typed error", function(){
        try{
            throw {message:'duck-typed error'};
            assert(false, "problem in test. throw must throw error but get ")
        }catch(err){
            var error = castError.unexpected(err);
            assert.equal(error.name, "Error");
            assert.equal(error.message, 'duck-typed error');
            assert.deepStrictEqual(theLog, [["unexpectedError", err],["not an Error in a catch", err]])
        }
    })
    it("warns about other type of error", function(){
        try{
            throw 42;
            assert(false, "problem in test. throw must throw error but get ")
        }catch(err){
            var error = castError.expected(err, castError.SystemError);
            assert.equal(error.name, "SystemError");
            assert.equal(error.message, '42');
            assert.deepStrictEqual(theLog, [["not an Error in a catch", err]])
        }
    })
    if(typeof process != "undefined" && Number(process.versions.node.split('.')[0])>=16){
        it("cause",async function(){ 
            try{
                throw new TypeError("a type error");
                assert(false, "problem in the design of 'cause' test")
            }catch(err){
                try{
                    // @ts-ignore
                    throw new Error("a plain error with cause", {cause: err});
                    assert(false, "problem in the design of 'cause' test (2)")
                }catch(err2){
                    var error = castError.expected(err2)
                    assert.equal(error.message, "a plain error with cause");
                    assert.equal(error.cause, err);
                }
            }
        })
    }
})