/**
 * Base class for all administrative units in Indonesia.
 * Follows SRP by only holding basic data.
 */
export class AdministrativeUnit {
    constructor(code, name) {
        this.code = code;
        this.name = name;
        if (!code)
            throw new Error("Administrative code cannot be empty.");
        if (!name)
            throw new Error("Administrative name cannot be empty.");
    }
}
export var RegencyType;
(function (RegencyType) {
    RegencyType["KABUPATEN"] = "KABUPATEN";
    RegencyType["KOTA"] = "KOTA";
})(RegencyType || (RegencyType = {}));
export var VillageType;
(function (VillageType) {
    VillageType["DESA"] = "DESA";
    VillageType["KELURAHAN"] = "KELURAHAN";
})(VillageType || (VillageType = {}));
