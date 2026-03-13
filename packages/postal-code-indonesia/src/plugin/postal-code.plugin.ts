import type { DataPlugin, Village } from '@damarkuncoro/data-wilayah-indonesia';
import { postalCodes } from '../data';

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
  private postalCodes: Record<string, string>;

  constructor() {
    this.postalCodes = postalCodes as Record<string, string>;
  }

  /**
   * Menambahkan kode pos pada data villages
   */
  async enrichVillages(villages: Village[]): Promise<Village[]> {
    return villages.map(v => ({
      ...v,
      postalCode: this.postalCodes[v.code] || ''
    }));
  }

  /**
   * Mendapatkan kode pos berdasarkan kode village
   */
  getPostalCode(villageCode: string): string {
    return this.postalCodes[villageCode] || '';
  }

  /**
   * Mendapatkan semua data kode pos
   */
  getAllPostalCodes(): Record<string, string> {
    return { ...this.postalCodes };
  }
}
