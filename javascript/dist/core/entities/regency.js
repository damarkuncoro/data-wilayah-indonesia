"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Regency = void 0;
const administrative_unit_1 = require("./administrative-unit");
/**
 * Regency/City entity.
 */
class Regency extends administrative_unit_1.AdministrativeUnit {
    constructor(code, name, provinceCode, type) {
        super(code, name);
        this.provinceCode = provinceCode;
        this.type = type;
        if (!provinceCode)
            throw new Error("Province code cannot be empty.");
    }
}
exports.Regency = Regency;
