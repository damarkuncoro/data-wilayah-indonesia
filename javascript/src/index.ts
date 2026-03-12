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
  private provinceRepo: JSONProvinceRepository;
  private regencyRepo: JSONRegencyRepository;
  private districtRepo: JSONDistrictRepository;
  private villageRepo: JSONVillageRepository;

  constructor(provider?: DataProvider, plugins: DataPlugin[] = []) {
    const dataProvider = provider || new JsonDataProvider();

    let provinces = dataProvider.getProvinces();
    let regencies = dataProvider.getRegencies();
    let districts = dataProvider.getDistricts();
    let villages = dataProvider.getVillages();

    // for (const plugin of plugins) {
    //   if (plugin.enrichProvinces) provinces = plugin.enrichProvinces(provinces);
    //   if (plugin.enrichRegencies) regencies = plugin.enrichRegencies(regencies);
    //   if (plugin.enrichDistricts) districts = plugin.enrichDistricts(districts);
    //   if (plugin.enrichVillages) villages = plugin.enrichVillages(villages);
    // }

    this.provinceRepo = new JSONProvinceRepository(provinces);
    this.regencyRepo = new JSONRegencyRepository(regencies);
    this.districtRepo = new JSONDistrictRepository(districts);
    this.villageRepo = new JSONVillageRepository(villages);
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

/**
 * Functional API - Wrapper for DataWilayahService
 * This allows for better tree-shaking and easier usage.
 */
let _defaultService: DataWilayahService | undefined;

function getDefaultService(): DataWilayahService {
  if (!_defaultService) {
    _defaultService = new DataWilayahService();
  }
  return _defaultService;
}

export async function getAllProvinces() { return (await getDefaultService()).getAllProvinces(); }
export async function getAllRegencies() { return (await getDefaultService()).getAllRegencies(); }
export async function getAllDistricts() { return (await getDefaultService()).getAllDistricts(); }
export async function getAllVillages() { return (await getDefaultService()).getAllVillages(); }

export async function getRegenciesByProvince(provinceCode: string) { return (await getDefaultService()).getRegenciesByProvince(provinceCode); }
export async function getDistrictsByRegency(regencyCode: string) { return (await getDefaultService()).getDistrictsByRegency(regencyCode); }
export async function getVillagesByDistrict(districtCode: string) { return (await getDefaultService()).getVillagesByDistrict(districtCode); }

export async function getProvinceByCode(code: string) { return (await getDefaultService()).getProvinceByCode(code); }
export async function getRegencyByCode(code: string) { return (await getDefaultService()).getRegencyByCode(code); }
export async function getDistrictByCode(code: string) { return (await getDefaultService()).getDistrictByCode(code); }
export async function getVillageByCode(code: string) { return (await getDefaultService()).getVillageByCode(code); }

export async function findProvincesByName(name: string) { return (await getDefaultService()).findProvincesByName(name); }
export async function search(name: string) { return (await getDefaultService()).search(name); }



// Re-export types and interfaces
export * from "./core/entities";
export { DataProvider } from "./core/provider";
export { DataPlugin } from "./core/plugin";
export { JsonDataProvider } from "./infrastructure/provider/json-provider";

/**
 * Data Source Information
 */
export const DATA_SOURCE = "Kepmendagri No. 050-145 Tahun 2022 (Terakhir Diperbarui 2024)";
export const DATA_VERSION = "1.1.1";
