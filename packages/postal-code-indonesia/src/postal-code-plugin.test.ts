import { PostalCodePlugin } from './index';



describe('PostalCodePlugin', () => {
  let plugin: PostalCodePlugin;

  beforeEach(() => {
    plugin = new PostalCodePlugin();
  });

  it('should enrich villages with postal codes', async () => {
    const villages = [
      { code: '11.06.03.2027', name: 'SEUREUMO', districtCode: '11.06.03', type: 'GAMPONG' },
      { code: '32.04.17.2005', name: 'CANGKUANG', districtCode: '32.04.17', type: 'DESA' },
    ];

    const enriched = await plugin.enrichVillages(villages);
    
    expect(enriched).toHaveLength(2);
    expect(enriched[0].postalCode).toBe('23363'); // Example postal code for SEUREUMO
    expect(enriched[1].postalCode).toBe('40386'); // Example postal code for CANGKUANG
  });

  it('should return an empty string for villages without a postal code', async () => {
    const villages = [
      { code: '99.99.99.9999', name: 'UNKNOWN', districtCode: '99.99.99', type: 'DESA' },
    ];
    const enriched = await plugin.enrichVillages(villages);
    expect(enriched[0].postalCode).toBe('');
  });
});
