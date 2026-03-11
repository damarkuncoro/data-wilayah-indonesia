"use strict";
/**
 * Tipe data untuk wilayah administratif Indonesia
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageType = exports.RegencyType = void 0;
/**
 * Jenis Kabupaten/Kota
 */
var RegencyType;
(function (RegencyType) {
    RegencyType["KABUPATEN"] = "KABUPATEN";
    RegencyType["KOTA"] = "KOTA";
})(RegencyType || (exports.RegencyType = RegencyType = {}));
/**
 * Jenis Desa/Kelurahan
 */
var VillageType;
(function (VillageType) {
    VillageType["DESA"] = "DESA";
    VillageType["KELURAHAN"] = "KELURAHAN";
})(VillageType || (exports.VillageType = VillageType = {}));
