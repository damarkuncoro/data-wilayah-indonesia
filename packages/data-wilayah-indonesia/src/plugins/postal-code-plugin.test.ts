
import { PostalCodePlugin } from './postal-code-plugin';
import { Village } from '../core/entities';

describe('PostalCodePlugin', () => {
  const mockVillages: Village[] = [
    { code: '11.01.01.2001', name: 'Village A', districtCode: '11.01.01', type: 'DESA' },
    { code: '11.01.01.2002', name: 'Village B', districtCode: '11.01.01', type: 'DESA' },
  ];

  const mockPostalCodes = {
    '11.01.01.2001': '12345',
    '11.01.01.2002': '54321',
  };

  beforeEach(() => {
    // Mock the global fetch function
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPostalCodes),
    } as any);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should enrich villages with postal codes', async () => {
    const plugin = new PostalCodePlugin();
    const enrichedVillages = await plugin.enrichVillages(mockVillages);

    expect(enrichedVillages).toHaveLength(2);
    expect(enrichedVillages[0].postalCode).toBe('12345');
    expect(enrichedVillages[1].postalCode).toBe('54321');
    expect(global.fetch).toHaveBeenCalledWith('/data/postal-codes/postal-codes.json');
  });

  it('should handle fetch errors gracefully', async () => {
    // Override the mock to simulate a network error
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const plugin = new PostalCodePlugin();
    const enrichedVillages = await plugin.enrichVillages(mockVillages);

    expect(enrichedVillages).toHaveLength(2);
    expect(enrichedVillages[0].postalCode).toBe('');
    expect(enrichedVillages[1].postalCode).toBe('');
  });
});
