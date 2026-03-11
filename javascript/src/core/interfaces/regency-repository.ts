import { Regency } from "../entities/regency";
import { Repository } from "./repository";

/**
 * Interface specifically for Regency repository.
 */
export interface RegencyRepository extends Repository<Regency> {
  findByProvinceCode(provinceCode: string): Regency[];
}
