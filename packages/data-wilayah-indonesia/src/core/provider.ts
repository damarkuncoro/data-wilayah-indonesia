import { Province, Regency, District, Village } from './entities';

export interface DataProvider {
  getProvinces(): Province[];
  getRegencies(): Regency[];
  getDistricts(): District[];
  getVillages(): Village[];
  
  /**
   * Load villages for a specific province asynchronously.
   * Useful for bundle size optimization (lazy loading).
   */
  getVillagesByProvince?(provinceCode: string): Promise<Village[]>;
}
