import postalCodes from '../data/postal-codes.json';

/**
 * DataPlugin interface - must be implemented by any plugin
 * This interface is compatible with @damarkuncoro/data-wilayah-indonesia
 */
export interface DataPlugin {
  name: string;
  enrichProvinces?(data: Province[]): Promise<Province[]> | Province[];
  enrichRegencies?(data: Regency[]): Promise<Regency[]> | Regency[];
  enrichDistricts?(data: District[]): Promise<District[]> | District[];
  enrichVillages?(data: Village[]): Promise<Village[]> | Village[];
}

/**
 * Village entity interface
 */
export interface Village {
  code: string;
  name: string;
  districtCode: string;
  districtName?: string;
  regencyCode?: string;
  regencyName?: string;
  provinceCode?: string;
  provinceName?: string;
  postalCode?: string;
}

/**
 * Province entity interface
 */
export interface Province {
  code: string;
  name: string;
}

/**
 * Regency entity interface
 */
export interface Regency {
  code: string;
  name: string;
  provinceCode: string;
}

/**
 * District entity interface
 */
export interface District {
  code: string;
  name: string;
  regencyCode: string;
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

/**
 * Functional API
 */
let _defaultPlugin: PostalCodePlugin | undefined;

function getDefaultPlugin(): PostalCodePlugin {
  if (!_defaultPlugin) {
    _defaultPlugin = new PostalCodePlugin();
  }
  return _defaultPlugin;
}

export function getPostalCode(villageCode: string): string {
  return getDefaultPlugin().getPostalCode(villageCode);
}

export function getAllPostalCodes(): Record<string, string> {
  return getDefaultPlugin().getAllPostalCodes();
}

/**
 * Package Information
 */
export const PLUGIN_NAME = 'postal-code-plugin';
export const PLUGIN_VERSION = '1.0.0';
