"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONRegencyRepository = void 0;
const base_json_repository_1 = require("./base-json-repository");
/**
 * JSON implementation for Regency repository.
 */
class JSONRegencyRepository extends base_json_repository_1.BaseJSONRepository {
    constructor(data) {
        super(data);
    }
    findByProvinceCode(provinceCode) {
        return this.data.filter(r => r.provinceCode === provinceCode);
    }
}
exports.JSONRegencyRepository = JSONRegencyRepository;
