import { DataProvider } from '../../core/provider';
import { Province, Regency, District, Village } from '../../core/entities';
import { provinces } from '../../data/base/provinces';
import { regencies } from '../../data/base/regencies';
import { districts } from '../../data/base/districts';
import * as path from 'path';

// Find the root of the installed package
const packageRoot = path.dirname(require.resolve('@damarkuncoro/data-wilayah-indonesia/package.json'));

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
    throw new Error('Loading all villages is not supported. Please use a more specific query.');
  }

  async getRegenciesByProvince(provinceCode: string): Promise<Regency[]> {
    return regencies.filter(r => r.provinceCode === provinceCode);
  }

  async getDistrictsByRegency(regencyCode: string): Promise<District[]> {
    return districts.filter(d => d.regencyCode === regencyCode);
  }

  private async loadVillages(provinceCode: string): Promise<Village[]> {
    try {
      // Construct a reliable path to the data file inside the installed package
      const dataPath = path.join(packageRoot, 'lib', 'data', 'villages', `${provinceCode}.js`);
      const module = await import(dataPath);
      return module.default || [];
    } catch (e) {
      return [];
    }
  }

  async getVillagesByProvince(provinceCode: string): Promise<Village[]> {
    return this.loadVillages(provinceCode);
  }

  async getVillagesByDistrict(districtCode: string): Promise<Village[]> {
    const provinceCode = districtCode.substring(0, 2);
    const villages = await this.loadVillages(provinceCode);
    return villages.filter((v: Village) => v.districtCode === districtCode);
  }
}
