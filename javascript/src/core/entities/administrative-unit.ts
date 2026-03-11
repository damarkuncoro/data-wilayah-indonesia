/**
 * Base class for all administrative units in Indonesia.
 * Follows SRP by only holding basic data.
 */
export abstract class AdministrativeUnit {
  constructor(
    public readonly code: string,
    public readonly name: string
  ) {
    if (!code) throw new Error("Administrative code cannot be empty.");
    if (!name) throw new Error("Administrative name cannot be empty.");
  }
}

export enum RegencyType {
  KABUPATEN = "KABUPATEN",
  KOTA = "KOTA",
}

export enum VillageType {
  DESA = "DESA",
  KELURAHAN = "KELURAHAN",
}
