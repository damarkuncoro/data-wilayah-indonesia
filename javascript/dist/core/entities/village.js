"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Village = void 0;
const administrative_unit_1 = require("./administrative-unit");
/**
 * Village entity.
 */
class Village extends administrative_unit_1.AdministrativeUnit {
    constructor(code, name, districtCode, type) {
        super(code, name);
        this.districtCode = districtCode;
        this.type = type;
        if (!districtCode)
            throw new Error("District code cannot be empty.");
    }
}
exports.Village = Village;
