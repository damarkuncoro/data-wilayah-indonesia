import { Province } from "./core/entities/province";
import { Regency } from "./core/entities/regency";
import { District } from "./core/entities/district";
import { Village } from "./core/entities/village";
/**
 * DataWilayahService - Facade class for Data Wilayah Indonesia.
 * Follows Clean Architecture (Composition Root).
 */
export declare class DataWilayahService {
    private provinceRepo;
    private regencyRepo;
    private districtRepo;
    private villageRepo;
    constructor();
    /**
     * Get all provinces.
     */
    getAllProvinces(): Province[];
    /**
     * Get all regencies.
     */
    getAllRegencies(): Regency[];
    /**
     * Get all districts.
     */
    getAllDistricts(): District[];
    /**
     * Get all villages.
     */
    getAllVillages(): Village[];
    /**
     * Get regencies by province code.
     */
    getRegenciesByProvince(provinceCode: string): Regency[];
    /**
     * Get districts by regency code.
     */
    getDistrictsByRegency(regencyCode: string): District[];
    /**
     * Get villages by district code.
     */
    getVillagesByDistrict(districtCode: string): Village[];
    /**
     * Get province by code.
     */
    getProvinceByCode(code: string): Province | undefined;
    /**
     * Find provinces by name.
     */
    findProvincesByName(name: string): Province[];
}
export * from "./core/entities/administrative-unit";
export * from "./core/entities/province";
export * from "./core/entities/regency";
export * from "./core/entities/district";
export * from "./core/entities/village";
//# sourceMappingURL=index.d.ts.map