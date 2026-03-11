"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.District = void 0;
const administrative_unit_1 = require("./administrative-unit");
/**
 * District entity.
 */
class District extends administrative_unit_1.AdministrativeUnit {
    constructor(code, name, regencyCode) {
        super(code, name);
        this.regencyCode = regencyCode;
        if (!regencyCode)
            throw new Error("Regency code cannot be empty.");
    }
}
exports.District = District;
