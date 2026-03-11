import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for Village repository.
 */
export class JSONVillageRepository extends BaseJSONRepository {
    constructor(data) {
        super(data);
    }
    findByDistrictCode(districtCode) {
        return this.data.filter(v => v.districtCode === districtCode);
    }
}
