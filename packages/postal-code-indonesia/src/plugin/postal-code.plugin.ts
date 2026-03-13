export interface Village {
  code: string;
  name: string;
  districtCode: string;
  [key: string]: any;
}

export interface DataPlugin {
  name: string;
  enrichVillages(villages: Village[]): Promise<Village[]>;
}


/**
 * PostalCodePlugin - Plugin untuk menambahkan kode pos pada data villages
 * 
 * Berguna untuk menghubungkan data wilayah administratif Indonesia dengan
 * kode pos yang valid.
 * 
 * @example
 * ```typescript
 * import { DataWilayahService } from '@damarkuncoro/data-wilayah-indonesia';
 * import { PostalCodePlugin } from '@damarkuncoro/postal-code-plugin';
 * 
 * const service = new DataWilayahService(undefined, [new PostalCodePlugin()]);
 * const villages = await service.fetchVillagesByDistrict('11.06.03');
 * // villages akan memiliki properti postalCode
 * ```
 */
export class PostalCodePlugin implements DataPlugin {
  name = 'postal-code';
  // Cache now stores data per regency, keyed by regency code (e.g., "11.01")
  private cache: Record<string, Record<string, string>> = {};

  /**
   * Loads postal code data for a specific regency on-demand.
   */
  private async loadRegencyData(regencyFullCode: string): Promise<Record<string, string>> {
    if (this.cache[regencyFullCode]) {
      return this.cache[regencyFullCode];
    }

    const provinceCode = regencyFullCode.substring(0, 2);
    const regencyCode = regencyFullCode.substring(3, 5);

    try {
      const module = await import(`../data/postal-codes/${provinceCode}/${regencyCode}.ts`);
      this.cache[regencyFullCode] = module.default || {};
      return this.cache[regencyFullCode];
    } catch (e) {
      // If data for a regency doesn't exist, cache an empty object to avoid re-fetching.
      this.cache[regencyFullCode] = {};
      return {};
    }
  }

  /**
   * Menambahkan kode pos pada data villages
   */
  async enrichVillages(villages: Village[]): Promise<Village[]> {
    if (!villages || villages.length === 0) {
      return [];
    }

    // Group unique regency codes to load data efficiently
    const regencyCodesToLoad = new Set<string>();
    for (const village of villages) {
      const regencyFullCode = village.code.substring(0, 5);
      regencyCodesToLoad.add(regencyFullCode);
    }

    // Load data for all required regencies in parallel
    const regencyDataPromises = Array.from(regencyCodesToLoad).map(regencyCode =>
      this.loadRegencyData(regencyCode)
    );
    await Promise.all(regencyDataPromises);

    // Enrich the villages with the loaded data
    const enrichedVillages = villages.map(v => {
      const regencyFullCode = v.code.substring(0, 5);
      const postalCode = this.cache[regencyFullCode]?.[v.code] || '';
      return {
        ...v,
        postalCode,
      };
    });

    return enrichedVillages;
  }
}
