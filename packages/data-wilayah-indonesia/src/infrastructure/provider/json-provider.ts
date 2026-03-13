import { DataProvider } from '../../core/provider';
import { Province, Regency, District, Village } from '../../core/entities';
import { provinces } from '../../data/base/provinces';
import { regencies } from '../../data/base/regencies';
import { districts } from '../../data/base/districts';
import { villages } from '../../data/base/villages';


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
    return villages;
  }

  async getRegenciesByProvince(provinceCode: string): Promise<Regency[]> {
    return regencies.filter(r => r.provinceCode === provinceCode);
  }

  async getDistrictsByRegency(regencyCode: string): Promise<District[]> {
    return districts.filter(d => d.regencyCode === regencyCode);
  }

  private async fetchJson<T>(url: string): Promise<T | null> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (e) {
      return null;
    }
  }

  async getVillagesByProvince(provinceCode: string): Promise<Village[]> {
    const villages = await this.fetchJson<Village[]>(`/data/villages/${provinceCode}.json`);
    return villages || [];
  }

  async getVillagesByDistrict(districtCode: string): Promise<Village[]> {
    const provinceCode = districtCode.substring(0, 2);
    const villages = await this.fetchJson<Village[]>(`/data/villages/${provinceCode}.json`);
    return (villages || []).filter(v => v.districtCode === districtCode);
  }
}
