/**
 * Base class for all administrative units in Indonesia.
 * Follows SRP by only holding basic data.
 */
export declare abstract class AdministrativeUnit {
    readonly code: string;
    readonly name: string;
    constructor(code: string, name: string);
}
export declare enum RegencyType {
    KABUPATEN = "KABUPATEN",
    KOTA = "KOTA"
}
export declare enum VillageType {
    DESA = "DESA",
    KELURAHAN = "KELURAHAN"
}
//# sourceMappingURL=administrative-unit.d.ts.map