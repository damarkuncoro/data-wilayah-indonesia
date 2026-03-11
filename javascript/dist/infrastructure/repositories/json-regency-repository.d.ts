import { Regency } from "../../core/entities/regency";
import { RegencyRepository } from "../../core/interfaces/regency-repository";
import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for Regency repository.
 */
export declare class JSONRegencyRepository extends BaseJSONRepository<Regency> implements RegencyRepository {
    constructor(data: Regency[]);
    findByProvinceCode(provinceCode: string): Regency[];
}
//# sourceMappingURL=json-regency-repository.d.ts.map