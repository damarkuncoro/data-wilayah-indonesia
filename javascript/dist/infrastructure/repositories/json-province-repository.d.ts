import { Province } from "../../core/entities/province";
import { ProvinceRepository } from "../../core/interfaces/province-repository";
import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for Province repository.
 */
export declare class JSONProvinceRepository extends BaseJSONRepository<Province> implements ProvinceRepository {
    constructor(data: Province[]);
}
//# sourceMappingURL=json-province-repository.d.ts.map