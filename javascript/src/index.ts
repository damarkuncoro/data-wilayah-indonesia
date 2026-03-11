import { Province } from "./core/entities/province";
import { Regency } from "./core/entities/regency";
import { District } from "./core/entities/district";
import { Village } from "./core/entities/village";
import { JSONProvinceRepository } from "./infrastructure/repositories/json-province-repository";
import { JSONRegencyRepository } from "./infrastructure/repositories/json-regency-repository";
import { JSONDistrictRepository } from "./infrastructure/repositories/json-district-repository";
import { JSONVillageRepository } from "./infrastructure/repositories/json-village-repository";

// Load data (In a real package, this might be handled by a factory or dependency injection)
import provincesData from '@damarkuncoro/data-wilayah-indonesia/data/provinces.json';
import regenciesData from '@damarkuncoro/data-wilayah-indonesia/data/regencies.json';
import districtsData from '@damarkuncoro/data-wilayah-indonesia/data/districts.json';
import villagesData from '@damarkuncoro/data-wilayah-indonesia/data/villages.json';

/**
 * DataWilayahService - Facade class for Data Wilayah Indonesia.
 * Follows Clean Architecture (Composition Root) with Lazy Initialization.
 */
export class DataWilayahService {
  private _provinceRepo?: JSONProvinceRepository;
  private _regencyRepo?: JSONRegencyRepository;
  private _districtRepo?: JSONDistrictRepository;
  private _villageRepo?: JSONVillageRepository;

  constructor() {}

  private get provinceRepo(): JSONProvinceRepository {
    if (!this._provinceRepo) {
      this._provinceRepo = new JSONProvinceRepository(provincesData as Province[]);
    }
    return this._provinceRepo;
  }

  private get regencyRepo(): JSONRegencyRepository {
    if (!this._regencyRepo) {
      this._regencyRepo = new JSONRegencyRepository(regenciesData as Regency[]);
    }
    return this._regencyRepo;
  }

  private get districtRepo(): JSONDistrictRepository {
    if (!this._districtRepo) {
      this._districtRepo = new JSONDistrictRepository(districtsData as District[]);
    }
    return this._districtRepo;
  }

  private get villageRepo(): JSONVillageRepository {
    if (!this._villageRepo) {
      this._villageRepo = new JSONVillageRepository(villagesData as Village[]);
    }
    return this._villageRepo;
  }

  /**
   * Get all provinces.
   */
  getAllProvinces(): Province[] {
    return this.provinceRepo.getAll();
  }

  /**
   * Get all regencies.
   */
  getAllRegencies(): Regency[] {
    return this.regencyRepo.getAll();
  }

  /**
   * Get all districts.
   */
  getAllDistricts(): District[] {
    return this.districtRepo.getAll();
  }

  /**
   * Get all villages.
   */
  getAllVillages(): Village[] {
    return this.villageRepo.getAll();
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

  /**
   * Global search for any administrative unit by name.
   */
  search(name: string): { type: string; item: any }[] {
    const results: { type: string; item: any }[] = [];
    
    this.provinceRepo.findByName(name).forEach(p => results.push({ type: 'PROVINCE', item: p }));
    this.regencyRepo.findByName(name).forEach(r => results.push({ type: 'REGENCY', item: r }));
    this.districtRepo.findByName(name).forEach(d => results.push({ type: 'DISTRICT', item: d }));
    this.villageRepo.findByName(name).forEach(v => results.push({ type: 'VILLAGE', item: v }));
    
    return results;
  }
}

// Re-export types for convenience
export * from "./core/entities/administrative-unit";
export * from "./core/entities/province";
export * from "./core/entities/regency";
export * from "./core/entities/district";
export * from "./core/entities/village";
