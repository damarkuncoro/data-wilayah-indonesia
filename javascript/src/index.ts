import { Province } from "./core/entities/province";
import { Regency } from "./core/entities/regency";
import { District } from "./core/entities/district";
import { Village } from "./core/entities/village";
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
  private provinceRepo: JSONProvinceRepository;
  private regencyRepo: JSONRegencyRepository;
  private districtRepo: JSONDistrictRepository;
  private villageRepo: JSONVillageRepository;

  constructor() {
    this.provinceRepo = new JSONProvinceRepository(provincesData as Province[]);
    this.regencyRepo = new JSONRegencyRepository(regenciesData as Regency[]);
    this.districtRepo = new JSONDistrictRepository(districtsData as District[]);
    this.villageRepo = new JSONVillageRepository(villagesData as Village[]);
  }

  /**
   * Get all provinces.
   */
  getAllProvinces(): Province[] {
    return this.provinceRepo.getAll();
  }

  /**
   * Get regencies by province code.
   */
  getRegenciesByProvince(provinceCode: string): Regency[] {
    return this.regencyRepo.findByProvinceCode(provinceCode);
  }

  /**
   * Get districts by regency code.
   */
  getDistrictsByRegency(regencyCode: string): District[] {
    return this.districtRepo.findByRegencyCode(regencyCode);
  }

  /**
   * Get villages by district code.
   */
  getVillagesByDistrict(districtCode: string): Village[] {
    return this.villageRepo.findByDistrictCode(districtCode);
  }

  /**
   * Get province by code.
   */
  getProvinceByCode(code: string): Province | undefined {
    return this.provinceRepo.getByCode(code);
  }

  /**
   * Find provinces by name.
   */
  findProvincesByName(name: string): Province[] {
    return this.provinceRepo.findByName(name);
  }
}

// Re-export types for convenience
export * from "./core/entities/administrative-unit";
export * from "./core/entities/province";
export * from "./core/entities/regency";
export * from "./core/entities/district";
export * from "./core/entities/village";
