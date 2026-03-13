import { DataProvider } from '../../core/provider';
import { Province, Regency, District, Village } from '../../core/entities';
import { provinces } from '../../data/base/provinces';
import { regencies } from '../../data/base/regencies';
import { districts } from '../../data/base/districts';
import * as path from 'path';
import * as fs from 'fs';

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
      let dataPath = '';
      
      // possiblePaths relative to the compiled file location in lib/esm or lib/cjs
      const possiblePaths = [
        // From lib/esm/infrastructure/provider/json-provider.js
        path.join(__dirname, '..', '..', 'data', 'villages', `${provinceCode}.js`),
        // From lib/cjs/infrastructure/provider/json-provider.js
        path.join(__dirname, '..', '..', 'data', 'villages', `${provinceCode}.js`),
        // From src/infrastructure/provider/json-provider.ts (during development/ts-node)
        path.join(__dirname, '..', '..', '..', 'lib', 'data', 'villages', `${provinceCode}.js`),
      ];

      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          dataPath = p;
          break;
        }
      }

      if (!dataPath) {
        // Fallback: try to resolve via package name
        try {
          const pkgRoot = path.dirname(require.resolve('@damarkuncoro/data-wilayah-indonesia/package.json'));
          const p = path.join(pkgRoot, 'lib', 'data', 'villages', `${provinceCode}.js`);
          if (fs.existsSync(p)) {
            dataPath = p;
          }
        } catch {}
      }

      if (dataPath) {
        const module = await import(dataPath);
        // Handle both CommonJS (module.exports) and ESM (export default)
        return module.default || module || [];
      }
      
      return [];
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
