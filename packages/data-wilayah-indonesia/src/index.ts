import { Province, Regency, District, Village } from "./core/entities";
import { DataProvider } from "./core/provider";
import { DataPlugin } from "./core/plugin";
import { JsonDataProvider } from "./infrastructure/provider/json-provider";
import { JSONProvinceRepository } from "./infrastructure/repositories/json-province-repository";
import { JSONRegencyRepository } from "./infrastructure/repositories/json-regency-repository";
import { JSONDistrictRepository } from "./infrastructure/repositories/json-district-repository";


/**
 * DataWilayahService - Facade class for Data Wilayah Indonesia.
 * Follows Clean Architecture (Composition Root) with Lazy Initialization.
 */
export class DataWilayahService {
  private provinceRepo: JSONProvinceRepository;
  private regencyRepo: JSONRegencyRepository;
  private districtRepo: JSONDistrictRepository;

  private plugins: DataPlugin[];
  private dataProvider: DataProvider;

  constructor(provider?: DataProvider, plugins: DataPlugin[] = []) {
    this.plugins = plugins;
    this.dataProvider = provider || new JsonDataProvider();

    let provinces = this.dataProvider.getProvinces();
    let regencies = this.dataProvider.getRegencies();
    let districts = this.dataProvider.getDistricts();
    this.provinceRepo = new JSONProvinceRepository(provinces);
    this.regencyRepo = new JSONRegencyRepository(regencies);
    this.districtRepo = new JSONDistrictRepository(districts);
  }

  private async applyPlugins<T>(data: T[], enricher: (plugin: DataPlugin, data: T[]) => Promise<T[]> | T[]): Promise<T[]> {
    let enrichedData = data;
    for (const plugin of this.plugins) {
      enrichedData = await enricher(plugin, enrichedData);
    }
    return enrichedData;
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
   * Fetch regencies by province code (Lazy Loading).
   */
  async fetchRegenciesByProvince(provinceCode: string): Promise<Regency[]> {
    const regencies = await this.dataProvider.getRegenciesByProvince(provinceCode);
    return this.applyPlugins(regencies, (p, data) => (p.enrichRegencies ? p.enrichRegencies(data) : data));
  }

  /**
   * Fetch districts by regency code (Lazy Loading).
   */
  async fetchDistrictsByRegency(regencyCode: string): Promise<District[]> {
    const districts = await this.dataProvider.getDistrictsByRegency(regencyCode);
    return this.applyPlugins(districts, (p, data) => (p.enrichDistricts ? p.enrichDistricts(data) : data));
  }

  /**
   * Fetch villages by province code (Lazy Loading).
   */
  async fetchVillagesByProvince(provinceCode: string): Promise<Village[]> {
    const villages = await this.dataProvider.getVillagesByProvince(provinceCode);
    return this.applyPlugins(villages, (p, data) => (p.enrichVillages ? p.enrichVillages(data) : data));
  }

  /**
   * Fetch villages by district code (Lazy Loading).
   */
  async fetchVillagesByDistrict(districtCode: string): Promise<Village[]> {
    const villages = await this.dataProvider.getVillagesByDistrict(districtCode);
    return this.applyPlugins(villages, (p, data) => (p.enrichVillages ? p.enrichVillages(data) : data));
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
  async getVillageByCode(code: string): Promise<Village | undefined> {
    // Village code must be 13 characters long (e.g., 11.01.01.2001)
    // and district code is the first 8 characters (e.g., 11.01.01).
    if (code.length !== 13) {
      return undefined;
    }
    const districtCode = code.substring(0, 8);
    const villages = await this.fetchVillagesByDistrict(districtCode);
    return villages.find(v => v.code === code);
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

export function getAllProvinces() { return getDefaultService().getAllProvinces(); }
export function getAllRegencies() { return getDefaultService().getAllRegencies(); }
export function getAllDistricts() { return getDefaultService().getAllDistricts(); }


export function getRegenciesByProvince(provinceCode: string) { return getDefaultService().getRegenciesByProvince(provinceCode); }
export function getDistrictsByRegency(regencyCode: string) { return getDefaultService().getDistrictsByRegency(regencyCode); }


export async function fetchRegenciesByProvince(provinceCode: string) { return getDefaultService().fetchRegenciesByProvince(provinceCode); }
export async function fetchDistrictsByRegency(regencyCode: string) { return getDefaultService().fetchDistrictsByRegency(regencyCode); }
export async function fetchVillagesByProvince(provinceCode: string) { return getDefaultService().fetchVillagesByProvince(provinceCode); }
export async function fetchVillagesByDistrict(districtCode: string) { return getDefaultService().fetchVillagesByDistrict(districtCode); }

export function getProvinceByCode(code: string) { return getDefaultService().getProvinceByCode(code); }
export function getRegencyByCode(code: string) { return getDefaultService().getRegencyByCode(code); }
export function getDistrictByCode(code: string) { return getDefaultService().getDistrictByCode(code); }
export async function getVillageByCode(code: string) { return getDefaultService().getVillageByCode(code); }

export function findProvincesByName(name: string) { return getDefaultService().findProvincesByName(name); }
export function search(name: string) { return getDefaultService().search(name); }



// Re-export types and interfaces
export * from "./core/entities";
export { DataProvider } from "./core/provider";
export * from './core/plugin';

export { JsonDataProvider } from "./infrastructure/provider/json-provider";

/**
 * Data Source Information
 */
export const DATA_SOURCE = "Kepmendagri No. 050-145 Tahun 2022 (Terakhir Diperbarui 2024)";
export const DATA_VERSION = "1.2.1";
