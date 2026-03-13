import { DataProvider } from '../../core/provider';
import { Province, Regency, District, Village } from '../../core/entities';

// Data sampel kecil untuk pengujian
const mockProvinces: Province[] = [
  { code: '31', name: 'DKI Jakarta' },
  { code: '32', name: 'Jawa Barat' },
];

const mockRegencies: Regency[] = [
  { code: '31.71', name: 'Jakarta Pusat', provinceCode: '31', type: 'KOTA' },
];

const mockDistricts: District[] = [
  { code: '31.71.01', name: 'Gambir', regencyCode: '31.71' },
];

const mockVillages: Village[] = [
  { code: '31.71.01.1001', name: 'Gambir', districtCode: '31.71.01', type: 'KELURAHAN' },
  { code: '31.71.01.1002', name: 'Cideng', districtCode: '31.71.01', type: 'KELURAHAN' },
];

export class MockDataProvider implements DataProvider {
  getProvinces(): Province[] {
    return mockProvinces;
  }

  getRegencies(): Regency[] {
    return mockRegencies;
  }

  getDistricts(): District[] {
    return mockDistricts;
  }

  getVillages(): Village[] {
    return mockVillages;
  }

  async getRegenciesByProvince(provinceCode: string): Promise<Regency[]> {
    return mockRegencies.filter(r => r.provinceCode === provinceCode);
  }

  async getDistrictsByRegency(regencyCode: string): Promise<District[]> {
    return mockDistricts.filter(d => d.regencyCode === regencyCode);
  }

  async getVillagesByProvince(provinceCode: string): Promise<Village[]> {
    const regencies = mockRegencies.filter(r => r.provinceCode === provinceCode);
    const regencyCodes = regencies.map(r => r.code);
    const districts = mockDistricts.filter(d => regencyCodes.includes(d.regencyCode));
    const districtCodes = districts.map(d => d.code);
    return mockVillages.filter(v => districtCodes.includes(v.districtCode));
  }

  async getVillagesByDistrict(districtCode: string): Promise<Village[]> {
    return mockVillages.filter(v => v.districtCode === districtCode);
  }
}
