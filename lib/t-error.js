"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.unexpected = exports.expected = exports.setLogFunction = exports.ExtendedError = void 0;
var ExtendedError = /** @class */ (function (_super) {
    __extends(ExtendedError, _super);
    function ExtendedError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'ExtendedError';
        _this.code = 'UNKNOWN';
        return _this;
    }
    return ExtendedError;
}(Error));
exports.ExtendedError = ExtendedError;
var logFunction = console.error;
function setLogFunction(f) {
    logFunction = f;
}
exports.setLogFunction = setLogFunction;
function expected(err, constructor) {
    if (err instanceof Error) {
        if (constructor != null && !(err instanceof constructor))
            logFunction("not a \"" + constructor.name + "\" in a catch:", err);
        return err;
    }
    logFunction('not an Error in a catch', err);
    var message = err == null ? "null error in catch" : (typeof err == "string" ? err : (
    // @ts-ignore
    typeof err == "object" && "message" in err ? err.message : err)).toString();
    // @ts-ignore
    return new (constructor || Error)(message);
}
exports.expected = expected;
function unexpected(err, constructor) {
    logFunction('unexpectedError', err);
    return expected(err, constructor);
}
exports.unexpected = unexpected;
//# sourceMappingURL=t-error.js.map