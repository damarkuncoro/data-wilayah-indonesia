import { District } from "../../core/entities/district";
import { DistrictRepository } from "../../core/interfaces/district-repository";
import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for District repository.
 */
export declare class JSONDistrictRepository extends BaseJSONRepository<District> implements DistrictRepository {
    constructor(data: District[]);
    findByRegencyCode(regencyCode: string): District[];
}
//# sourceMappingURL=json-district-repository.d.ts.map