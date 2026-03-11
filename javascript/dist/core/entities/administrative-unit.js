"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageType = exports.RegencyType = exports.AdministrativeUnit = void 0;
/**
 * Base class for all administrative units in Indonesia.
 * Follows SRP by only holding basic data.
 */
class AdministrativeUnit {
    constructor(code, name) {
        this.code = code;
        this.name = name;
        if (!code)
            throw new Error("Administrative code cannot be empty.");
        if (!name)
            throw new Error("Administrative name cannot be empty.");
    }
}
exports.AdministrativeUnit = AdministrativeUnit;
var RegencyType;
(function (RegencyType) {
    RegencyType["KABUPATEN"] = "KABUPATEN";
    RegencyType["KOTA"] = "KOTA";
})(RegencyType || (exports.RegencyType = RegencyType = {}));
var VillageType;
(function (VillageType) {
    VillageType["DESA"] = "DESA";
    VillageType["KELURAHAN"] = "KELURAHAN";
})(VillageType || (exports.VillageType = VillageType = {}));
