import { DataPlugin } from '../core/plugin';
import { Village } from '../core/entities';

export class PostalCodePlugin implements DataPlugin {
  name = 'postal-code';
  private postalCodes: Record<string, string> | null = null;

  private async loadPostalCodes(): Promise<Record<string, string>> {
    if (this.postalCodes) {
      return this.postalCodes;
    }

    try {
      const response = await fetch('/data/postal-codes/postal-codes.json');
      this.postalCodes = await response.json();
      return this.postalCodes || {};
    } catch (e) {
      console.warn(`[PostalCodePlugin] Could not fetch postal codes.`);
      return {};
    }
  }

  async enrichVillages(villages: Village[]): Promise<Village[]> {
    const postalCodes = await this.loadPostalCodes();
    return villages.map(v => ({
      ...v,
      postalCode: postalCodes[v.code] || ''
    }));
  }
}
