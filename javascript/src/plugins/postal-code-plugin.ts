import { DataPlugin } from '../core/plugin';
import { Village } from '../core/entities';

import postalCodes from '../../data/postal-codes/postal-codes.json';

export class PostalCodePlugin implements DataPlugin {
  name = 'postal-code';

  enrichVillages(villages: Village[]): Village[] {
    return villages.map(v => ({
      ...v,
      postalCode: (postalCodes as Record<string, string>)[v.code] || ''
    }));
  }
}
