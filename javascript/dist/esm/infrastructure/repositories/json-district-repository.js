import { BaseJSONRepository } from "./base-json-repository";
/**
 * JSON implementation for District repository.
 */
export class JSONDistrictRepository extends BaseJSONRepository {
    constructor(data) {
        super(data);
    }
    findByRegencyCode(regencyCode) {
        return this.data.filter(d => d.regencyCode === regencyCode);
    }
}
