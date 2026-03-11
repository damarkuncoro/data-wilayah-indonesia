import { DataPlugin } from '../core/plugin';
import { Village } from '../core/entities';

export class PostalCodePlugin implements DataPlugin {
  name = 'postal-code-plugin';

  /**
   * Mock implementation of postal code enrichment.
   * In a real scenario, this could load from a separate JSON or fetch from an API.
   */
  enrichVillages(villages: Village[]): Village[] {
    return villages.map(village => {
      // Mocking: every village gets a postal code based on its code
      // (This is just for demonstration)
      return {
        ...village,
        postalCode: this.mockPostalCode(village.code)
      };
    });
  }

  private mockPostalCode(code: string): string {
    // Generate a pseudo-random postal code from the last few digits
    const suffix = code.split('.').pop() || '000';
    return `23${suffix.padStart(3, '0')}`;
  }
}
