import { JSONProvinceRepository } from "./infrastructure/repositories/json-province-repository";
import { JSONRegencyRepository } from "./infrastructure/repositories/json-regency-repository";
import { JSONDistrictRepository } from "./infrastructure/repositories/json-district-repository";
import { JSONVillageRepository } from "./infrastructure/repositories/json-village-repository";
// Load data (In a real package, this might be handled by a factory or dependency injection)
import provincesData from "../data/provinces.json";
import regenciesData from "../data/regencies.json";
import districtsData from "../data/districts.json";
import villagesData from "../data/villages.json";
/**
 * DataWilayahService - Facade class for Data Wilayah Indonesia.
 * Follows Clean Architecture (Composition Root).
 */
export class DataWilayahService {
    constructor() {
        this.provinceRepo = new JSONProvinceRepository(provincesData);
        this.regencyRepo = new JSONRegencyRepository(regenciesData);
        this.districtRepo = new JSONDistrictRepository(districtsData);
        this.villageRepo = new JSONVillageRepository(villagesData);
    }
    /**
     * Get all provinces.
     */
    getAllProvinces() {
        return this.provinceRepo.getAll();
    }
    /**
     * Get regencies by province code.
     */
    getRegenciesByProvince(provinceCode) {
        return this.regencyRepo.findByProvinceCode(provinceCode);
    }
    /**
     * Get districts by regency code.
     */
    getDistrictsByRegency(regencyCode) {
        return this.districtRepo.findByRegencyCode(regencyCode);
    }
    /**
     * Get villages by district code.
     */
    getVillagesByDistrict(districtCode) {
        return this.villageRepo.findByDistrictCode(districtCode);
    }
    /**
     * Get province by code.
     */
    getProvinceByCode(code) {
        return this.provinceRepo.getByCode(code);
    }
    /**
     * Find provinces by name.
     */
    findProvincesByName(name) {
        return this.provinceRepo.findByName(name);
    }
}
// Re-export types for convenience
export * from "./core/entities/administrative-unit";
export * from "./core/entities/province";
export * from "./core/entities/regency";
export * from "./core/entities/district";
export * from "./core/entities/village";
