import { Province, Regency, District, Village } from './entities';

export interface DataPlugin {
  name: string;
  enrichProvinces?(data: Province[]): Promise<Province[]> | Province[];
  enrichRegencies?(data: Regency[]): Promise<Regency[]> | Regency[];
  enrichDistricts?(data: District[]): Promise<District[]> | District[];
  enrichVillages?(data: Village[]): Promise<Village[]> | Village[];
}