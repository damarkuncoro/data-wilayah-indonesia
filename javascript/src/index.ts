import { Province, Regency, District, Village } from "./core/entities";
import { DataProvider } from "./core/provider";
import { DataPlugin } from "./core/plugin";
import { JsonDataProvider } from "./infrastructure/provider/json-provider";
import { JSONProvinceRepository } from "./infrastructure/repositories/json-province-repository";
import { JSONRegencyRepository } from "./infrastructure/repositories/json-regency-repository";
import { JSONDistrictRepository } from "./infrastructure/repositories/json-district-repository";
import { JSONVillageRepository } from "./infrastructure/repositories/json-village-repository";

/**
 * DataWilayahService - Facade class for Data Wilayah Indonesia.
 * Follows Clean Architecture (Composition Root) with Lazy Initialization.
 */
export class DataWilayahService {
  private _provinceRepo?: JSONProvinceRepository;
  private _regencyRepo?: JSONRegencyRepository;
  private _districtRepo?: JSONDistrictRepository;
  private _villageRepo?: JSONVillageRepository;

  private provider: DataProvider;
  private plugins: DataPlugin[];

  constructor(provider?: DataProvider, plugins: DataPlugin[] = []) {
    this.provider = provider || new JsonDataProvider();
    this.plugins = plugins;
  }

  private get provinceRepo(): JSONProvinceRepository {
    if (!this._provinceRepo) {
      let data = this.provider.getProvinces();
      for (const plugin of this.plugins) {
        if (plugin.enrichProvinces) {
          data = plugin.enrichProvinces(data);
        }
      }
      this._provinceRepo = new JSONProvinceRepository(data);
    }
    return this._provinceRepo;
  }

  private get regencyRepo(): JSONRegencyRepository {
    if (!this._regencyRepo) {
      let data = this.provider.getRegencies();
      for (const plugin of this.plugins) {
        if (plugin.enrichRegencies) {
          data = plugin.enrichRegencies(data);
        }
      }
      this._regencyRepo = new JSONRegencyRepository(data);
    }
    return this._regencyRepo;
  }

  private get districtRepo(): JSONDistrictRepository {
    if (!this._districtRepo) {
      let data = this.provider.getDistricts();
      for (const plugin of this.plugins) {
        if (plugin.enrichDistricts) {
          data = plugin.enrichDistricts(data);
        }
      }
      this._districtRepo = new JSONDistrictRepository(data);
    }
    return this._districtRepo;
  }

  private get villageRepo(): JSONVillageRepository {
    if (!this._villageRepo) {
      let data = this.provider.getVillages();
      for (const plugin of this.plugins) {
        if (plugin.enrichVillages) {
          data = plugin.enrichVillages(data);
        }
      }
      this._villageRepo = new JSONVillageRepository(data);
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
   * Get regency by code.
   */
  getRegencyByCode(code: string): Regency | undefined {
    return this.regencyRepo.getByCode(code);
  }

  /**
   * Get district by code.
   */
  getDistrictByCode(code: string): District | undefined {
    return this.districtRepo.getByCode(code);
  }

  /**
   * Get village by code.
   */
  getVillageByCode(code: string): Village | undefined {
    return this.villageRepo.getByCode(code);
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
