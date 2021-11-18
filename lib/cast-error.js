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
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    exports.__esModule = true;
    exports.unexpected = exports.expected = exports.setLogFunction = exports.SystemError = void 0;
    var SystemError = /** @class */ (function (_super) {
        __extends(SystemError, _super);
        function SystemError(message) {
            var _this = _super.call(this, message) || this;
            _this.name = 'SystemError';
            return _this;
        }
        return SystemError;
    }(Error));
    exports.SystemError = SystemError;
    var logFunction = console.error;
    function setLogFunction(f) {
        logFunction = f;
    }
    exports.setLogFunction = setLogFunction;
    function expected(err, constructor) {
        if (err instanceof Error) {
            if (constructor != null && !(err instanceof constructor))
                logFunction("not a \"".concat(constructor.name, "\" in a catch:"), err);
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
});
//# sourceMappingURL=cast-error.js.map