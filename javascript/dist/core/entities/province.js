"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Province = void 0;
const administrative_unit_1 = require("./administrative-unit");
/**
 * Province entity.
 */
class Province extends administrative_unit_1.AdministrativeUnit {
    constructor(code, name) {
        super(code, name);
    }
}
exports.Province = Province;
