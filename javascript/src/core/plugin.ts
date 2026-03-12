import { Province, Regency, District, Village } from './entities';

export interface DataPlugin {
  name: string;
  enrichProvinces?(data: Province[]): Province[];
  enrichRegencies?(data: Regency[]): Regency[];
  enrichDistricts?(data: District[]): District[];
  enrichVillages?(data: Village[]): Village[];
}