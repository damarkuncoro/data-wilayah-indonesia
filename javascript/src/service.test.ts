import { DataWilayahService } from '../src/index';

describe('DataWilayahService', () => {
  let service: DataWilayahService;

  beforeAll(() => {
    service = new DataWilayahService();
  });

  test('should get all provinces', () => {
    const provinces = service.getAllProvinces();
    expect(provinces.length).toBeGreaterThan(0);
  });

  test('should find DKI Jakarta by code', () => {
    const jakarta = service.getProvinceByCode('31');
    expect(jakarta).toBeDefined();
    expect(jakarta?.name).toContain('JAKARTA');
  });

  test('should find regencies in Jakarta', () => {
    const regencies = service.getRegenciesByProvince('31');
    expect(regencies.length).toBeGreaterThan(0);
    expect(regencies[0].provinceCode).toBe('31');
  });
});
