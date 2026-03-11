import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for Regency repository.
 */
export class JSONRegencyRepository extends BaseJSONRepository {
    constructor(data) {
        super(data);
    }
    findByProvinceCode(provinceCode) {
        return this.data.filter(r => r.provinceCode === provinceCode);
    }
}
