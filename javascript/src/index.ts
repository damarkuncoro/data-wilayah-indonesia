/**
 * Data Wilayah Indonesia - Package JavaScript/TypeScript
 * untuk data wilayah administratif Indonesia
 */

import { Province, Regency, District, Village, RegencyType, VillageType, AdministrativeUnit } from './types/administrative';
import provincesData from '../data/provinces.json';
import regenciesData from '../data/regencies.json';
import districtsData from '../data/districts.json';
import villagesData from '../data/villages.json';

/**
 * DataWilayahService - Kelas utama untuk mengakses data wilayah Indonesia
 */
export class DataWilayahService {
  private provinces: Province[];
  private regencies: Regency[];
  private districts: District[];
  private villages: Village[];

  constructor() {
    this.provinces = provincesData as Province[];
    this.regencies = regenciesData as Regency[];
    this.districts = districtsData as District[];
    this.villages = villagesData as Village[];
  }

  /**
   * Mendapatkan semua provinsi
   */
  getAllProvinces(): Province[] {
    return this.provinces;
  }

  /**
   * Mendapatkan province berdasarkan kode
   */
  getProvinceByCode(code: string): Province | undefined {
    return this.provinces.find(p => p.code === code);
  }

  /**
   * Mencari province berdasarkan nama
   */
  findProvincesByName(name: string): Province[] {
    const lowerName = name.toLowerCase();
    return this.provinces.filter(p => p.name.toLowerCase().includes(lowerName));
  }

  /**
   * Mendapatkan kabupaten/kota berdasarkan kode provinsi
   */
  getRegenciesByProvince(provinceCode: string): Regency[] {
    return this.regencies.filter(r => r.provinceCode === provinceCode);
  }

  /**
   * Mendapatkan Regency berdasarkan kode
   */
  getRegencyByCode(code: string): Regency | undefined {
    return this.regencies.find(r => r.code === code);
  }

  /**
   * Mencari Regency berdasarkan nama
   */
  findRegenciesByName(name: string): Regency[] {
    const lowerName = name.toLowerCase();
    return this.regencies.filter(r => r.name.toLowerCase().includes(lowerName));
  }

  /**
   * Mendapatkan kecamatan berdasarkan kode kabupaten/kota
   */
  getDistrictsByRegency(regencyCode: string): District[] {
    return this.districts.filter(d => d.regencyCode === regencyCode);
  }

  /**
   * Mendapatkan District berdasarkan kode
   */
  getDistrictByCode(code: string): District | undefined {
    return this.districts.find(d => d.code === code);
  }

  /**
   * Mencari District berdasarkan nama
   */
  findDistrictsByName(name: string): District[] {
    const lowerName = name.toLowerCase();
    return this.districts.filter(d => d.name.toLowerCase().includes(lowerName));
  }

  /**
   * Mendapatkan desa/kelurahan berdasarkan kode kecamatan
   */
  getVillagesByDistrict(districtCode: string): Village[] {
    return this.villages.filter(v => v.districtCode === districtCode);
  }

  /**
   * Mendapatkan Village berdasarkan kode
   */
  getVillageByCode(code: string): Village | undefined {
    return this.villages.find(v => v.code === code);
  }

  /**
   * Mencari Village berdasarkan nama
   */
  findVillagesByName(name: string): Village[] {
    const lowerName = name.toLowerCase();
    return this.villages.filter(v => v.name.toLowerCase().includes(lowerName));
  }
}

// Export types
export { Province, Regency, District, Village, RegencyType, VillageType, AdministrativeUnit };

// Export data directly (for advanced users)
export { default as provincesData } from '../data/provinces.json';
export { default as regenciesData } from '../data/regencies.json';
export { default as districtsData } from '../data/districts.json';
export { default as villagesData } from '../data/villages.json';

// Default export
export default DataWilayahService;