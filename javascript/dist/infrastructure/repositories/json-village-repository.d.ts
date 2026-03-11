import { Village } from "../../core/entities/village";
import { VillageRepository } from "../../core/interfaces/village-repository";
import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for Village repository.
 */
export declare class JSONVillageRepository extends BaseJSONRepository<Village> implements VillageRepository {
    constructor(data: Village[]);
    findByDistrictCode(districtCode: string): Village[];
}
//# sourceMappingURL=json-village-repository.d.ts.map