import * as TError from "../lib/t-error";
import * as assert from "assert";
import {promises as fs} from "fs";

describe("t-error", function(){
    it("detects error type",async function(){
        try{
            await fs.readFile("non-existent.txt");
            assert(false, "problem in the design of test. non-existent.txt must do not exists")
        }catch(err){
            var error = TError.expected(err)
            assert.equal(error.code, "ENOENT")
        }
    })
})