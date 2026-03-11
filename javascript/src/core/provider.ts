import { Province, Regency, District, Village } from './entities';

export interface DataProvider {
  getProvinces(): Province[];
  getRegencies(): Regency[];
  getDistricts(): District[];
  getVillages(): Village[];
}
