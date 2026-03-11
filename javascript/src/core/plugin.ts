import { Province, Regency, District, Village } from './entities';

export interface DataPlugin {
  name: string;
  
  /**
   * Enrich the data from provider.
   * Can be used to add fields like postal codes, coordinates, etc.
   */
  enrichProvinces?(data: Province[]): Province[];
  enrichRegencies?(data: Regency[]): Regency[];
  enrichDistricts?(data: District[]): District[];
  enrichVillages?(data: Village[]): Village[];
}
