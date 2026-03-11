import { DataWilayahService } from './index';
import { PostalCodePlugin } from './plugins/postal-code-plugin';

describe('DataWilayahService with Plugins', () => {
  it('should enrich villages with postal codes using PostalCodePlugin', () => {
    const postalCodePlugin = new PostalCodePlugin();
    const service = new DataWilayahService(undefined, [postalCodePlugin]);

    // Test a specific village from Aceh (e.g., Keude Bakongan)
    const villageCode = '11.01.01.2001';
    const village = service.getVillageByCode(villageCode);

    expect(village).toBeDefined();
    expect(village?.name.toUpperCase()).toBe('KEUDE BAKONGAN');
    // The plugin should have added this field
    expect(village?.postalCode).toBeDefined();
    expect(typeof village?.postalCode).toBe('string');
    expect(village?.postalCode).toMatch(/^23\d+$/);
  });

  it('should not have postal codes if plugin is not used', () => {
    const service = new DataWilayahService();
    const villageCode = '11.01.01.2001';
    const village = service.getVillageByCode(villageCode);

    expect(village).toBeDefined();
    expect(village?.postalCode).toBeUndefined();
  });
});
