import { Province, Regency, District, Village } from './entities';

export interface DataProvider {
  getProvinces(): Province[];
  getRegencies(): Regency[];
  getDistricts(): District[];
  getVillages(): Village[];
  
  /**
   * Load regencies for a specific province asynchronously.
   */
  getRegenciesByProvince(provinceCode: string): Promise<Regency[]>;

  /**
   * Load districts for a specific regency asynchronously.
   */
  getDistrictsByRegency(regencyCode: string): Promise<District[]>;

  /**
   * Load villages for a specific province asynchronously.
   * Useful for bundle size optimization (lazy loading).
   */
  getVillagesByProvince(provinceCode: string): Promise<Village[]>;

  /**
   * Load villages for a specific district asynchronously.
   */
  getVillagesByDistrict(districtCode: string): Promise<Village[]>;
}
