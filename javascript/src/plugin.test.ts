import { DataWilayahService } from './index';
import { PostalCodePlugin } from './plugins/postal-code-plugin';

describe('DataWilayahService with Plugins', () => {
  it('should enrich villages with postal codes using PostalCodePlugin', () => {
    const postalCodePlugin = new PostalCodePlugin();
    const service = new DataWilayahService(undefined, [postalCodePlugin]);

    // Test a specific village that we know has been scraped
    const villageCode = '11.06.03.2027';
    const village = service.getVillageByCode(villageCode);

    expect(village).toBeDefined();
    expect(village?.name.toUpperCase()).toBe('SEUREUMO');
    // The plugin should have added this field
    expect(village?.postalCode).toBeDefined();
    expect(village?.postalCode).toBe('23363');
  });

  it('should not have postal codes if plugin is not used', () => {
    const service = new DataWilayahService();
    const villageCode = '11.06.03.2027';
    const village = service.getVillageByCode(villageCode);

    expect(village).toBeDefined();
    expect(village?.postalCode).toBeUndefined();
  });
});
