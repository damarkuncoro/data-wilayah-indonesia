import { DataPlugin } from '../core/plugin';
import { Village } from '../core/entities';

// Load the scraped postal codes
// Using require for JSON to handle different module resolution strategies
const postalCodes: Record<string, string> = require('../../data/postal-codes.json');

export class PostalCodePlugin implements DataPlugin {
  name = 'postal-code-plugin';

  enrichVillages(villages: Village[]): Village[] {
    return villages.map(village => {
      const postalCode = postalCodes[village.code];
      if (postalCode) {
        return {
          ...village,
          postalCode: postalCode
        };
      }
      return village;
    });
  }
}
