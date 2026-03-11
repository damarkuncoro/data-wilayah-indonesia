import { Regency } from "../../core/entities/regency";
import { RegencyRepository } from "../../core/interfaces/regency-repository";
import { BaseJSONRepository } from "./base-json-repository";

/**
 * JSON implementation for Regency repository.
 */
export class JSONRegencyRepository extends BaseJSONRepository<Regency> implements RegencyRepository {
  constructor(data: Regency[]) {
    super(data);
  }

  findByProvinceCode(provinceCode: string): Regency[] {
    return this.data.filter(r => r.provinceCode === provinceCode);
  }
}
