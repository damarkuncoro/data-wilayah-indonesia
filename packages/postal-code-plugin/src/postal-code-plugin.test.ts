import { PostalCodePlugin } from './index';


describe('PostalCodePlugin', () => {
  let plugin: PostalCodePlugin;

  beforeEach(() => {
    plugin = new PostalCodePlugin();
  });

  it('should have name "postal-code"', () => {
    expect(plugin.name).toBe('postal-code');
  });

  it('should enrich villages with postal codes', async () => {
    const villages = [
      { code: '11.06.03.2027', name: 'Desa Test', districtCode: '11.06.03' },
      { code: '11.06.03.2028', name: 'Desa Test 2', districtCode: '11.06.03' }
    ];

    const enriched = await plugin.enrichVillages(villages);

    expect(enriched[0].postalCode).toBe('23363');
    expect(enriched[1].postalCode).toBe('23363');
  });

  it('should return empty string for unknown village codes', async () => {
    const villages = [
      { code: '99.99.99.9999', name: 'Unknown Village', districtCode: '99.99.99' }
    ];

    const enriched = await plugin.enrichVillages(villages);

    expect(enriched[0].postalCode).toBe('');
  });

  it('should get postal code by village code', () => {
    expect(plugin.getPostalCode('11.06.03.2027')).toBe('23363');
    expect(plugin.getPostalCode('unknown')).toBe('');
  });

  it('should get all postal codes', () => {
    const allCodes = plugin.getAllPostalCodes();
    expect(Object.keys(allCodes).length).toBeGreaterThan(0);
    expect(allCodes['11.06.03.2027']).toBe('23363');
  });
});
