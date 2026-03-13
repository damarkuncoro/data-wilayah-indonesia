import type { DataPlugin, Village } from '@damarkuncoro/data-wilayah-indonesia';
import * as path from 'path';
import * as fs from 'fs';

/**
 * PostalCodePlugin - Plugin untuk menambahkan kode pos pada data villages
 */
export class PostalCodePlugin implements DataPlugin {
  name = 'postal-code';
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
      // Find the correct path to data files
      const possiblePaths = [
        // Development path (from src/plugin)
        path.join(__dirname, '..', 'data', 'postal-codes', provinceCode, `${regencyCode}.ts`),
        // Production path (from lib/esm/plugin or lib/cjs/plugin)
        path.join(__dirname, '..', '..', 'data', 'postal-codes', provinceCode, `${regencyCode}.js`),
        // Fallback production path (lib/plugin)
        path.join(__dirname, '..', 'data', 'postal-codes', provinceCode, `${regencyCode}.js`),
      ];

      let dataPath = '';
      for (const p of possiblePaths) {
        if (fs.existsSync(p)) {
          dataPath = p;
          break;
        }
      }

      if (dataPath) {
        const module = await import(dataPath);
        this.cache[regencyFullCode] = module.default || module || {};
        return this.cache[regencyFullCode];
      }

      this.cache[regencyFullCode] = {};
      return {};
    } catch (e) {
      console.error(`Failed to load postal code data for ${regencyFullCode}:`, e);
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

    const regencyCodesToLoad = new Set<string>();
    for (const village of villages) {
      const regencyFullCode = village.code.substring(0, 5);
      regencyCodesToLoad.add(regencyFullCode);
    }

    const regencyDataPromises = Array.from(regencyCodesToLoad).map(regencyCode =>
      this.loadRegencyData(regencyCode)
    );
    await Promise.all(regencyDataPromises);

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
