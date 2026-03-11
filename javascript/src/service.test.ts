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

  test('should find districts in Jakarta Pusat', () => {
    const districts = service.getDistrictsByRegency('31.71'); // 31.71 = Jakarta Pusat
    expect(districts.length).toBeGreaterThan(0);
    expect(districts[0].regencyCode).toBe('31.71');
  });

  test('should find villages in Kecamatan Gambir', () => {
    const villages = service.getVillagesByDistrict('31.71.01'); // 31.71.01 = Gambir
    expect(villages.length).toBeGreaterThan(0);
    expect(villages[0].districtCode).toBe('31.71.01');
  });
});
