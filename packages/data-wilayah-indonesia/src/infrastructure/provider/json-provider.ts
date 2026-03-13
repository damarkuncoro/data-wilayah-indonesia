import { DataProvider } from '../../core/provider';
import { Province, Regency, District, Village } from '../../core/entities';
import { provinces } from '../../data/base/provinces';
import { regencies } from '../../data/base/regencies';
import { districts } from '../../data/base/districts';

export class JsonDataProvider implements DataProvider {
  getProvinces(): Province[] {
    return provinces;
  }

  getRegencies(): Regency[] {
    return regencies;
  }

  getDistricts(): District[] {
    return districts;
  }

  getVillages(): Village[] {
    // Loading all villages at once is not supported due to performance reasons.
    // Please use getVillagesByDistrict or getVillagesByProvince instead.
    throw new Error('Loading all villages is not supported. Please use a more specific query.');
  }

  async getRegenciesByProvince(provinceCode: string): Promise<Regency[]> {
    return regencies.filter(r => r.provinceCode === provinceCode);
  }

  async getDistrictsByRegency(regencyCode: string): Promise<District[]> {
    return districts.filter(d => d.regencyCode === regencyCode);
  }

  async getVillagesByProvince(provinceCode: string): Promise<Village[]> {
    try {
      const module = await import(`../../../data/villages/${provinceCode}`);
      return module.default || [];
    } catch (e) {
      return [];
    }
  }

  async getVillagesByDistrict(districtCode: string): Promise<Village[]> {
    const provinceCode = districtCode.substring(0, 2);
    try {
      const module = await import(`../../../data/villages/${provinceCode}`);
      const villages = module.default || [];
      return villages.filter((v: Village) => v.districtCode === districtCode);
    } catch (e) {
      return [];
    }
  }
}
