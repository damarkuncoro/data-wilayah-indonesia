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

  /**
   * Lazy load villages by province code.
   * Note: This works best in bundlers like Vite or Webpack.
   */
  async getVillagesByProvince(provinceCode: string): Promise<Village[]> {
    try {
      // Use dynamic import for bundle splitting. 
      // The bundler will create a separate chunk for each province.
      const data = await import(`@damarkuncoro/data-wilayah-indonesia/data/villages/${provinceCode}.json`);
      return data.default || data;
    } catch (e) {
      // Fallback to local file if path alias fails (e.g. in tests)
      try {
        const data = await import(`../../../data/villages/${provinceCode}.json`);
        return data.default || data;
      } catch (err) {
        console.warn(`[DataWilayah] Could not lazy-load villages for province ${provinceCode}. Falling back to main bundle.`);
        return villages.filter(v => v.code.startsWith(provinceCode));
      }
    }
  }
}
