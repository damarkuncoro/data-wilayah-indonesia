"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONDistrictRepository = void 0;
const base_json_repository_1 = require("./base-json-repository");
/**
 * JSON implementation for District repository.
 */
class JSONDistrictRepository extends base_json_repository_1.BaseJSONRepository {
    constructor(data) {
        super(data);
    }
    findByRegencyCode(regencyCode) {
        return this.data.filter(d => d.regencyCode === regencyCode);
    }
}
exports.JSONDistrictRepository = JSONDistrictRepository;
