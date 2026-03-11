/**
 * Tipe data untuk wilayah administratif Indonesia
 */

/**
 * Jenis Kabupaten/Kota
 */
export enum RegencyType {
  KABUPATEN = "KABUPATEN",
  KOTA = "KOTA",
}

/**
 * Jenis Desa/Kelurahan
 */
export enum VillageType {
  DESA = "DESA",
  KELURAHAN = "KELURAHAN",
}

/**
 * Interface dasar untuk unit administratif
 */
export interface AdministrativeUnit {
  code: string;
  name: string;
}

/**
 * Interface untuk Provinsi
 */
export interface Province extends AdministrativeUnit {
  // Province adalah level tertinggi, tidak memiliki parent
}

/**
 * Interface untuk Kabupaten/Kota
 */
export interface Regency extends AdministrativeUnit {
  provinceCode: string;
  type: RegencyType;
}

/**
 * Interface untuk Kecamatan
 */
export interface District extends AdministrativeUnit {
  regencyCode: string;
}

/**
 * Interface untuk Desa/Kelurahan
 */
export interface Village extends AdministrativeUnit {
  districtCode: string;
  type: VillageType;
}