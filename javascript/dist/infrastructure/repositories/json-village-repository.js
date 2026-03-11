"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONVillageRepository = void 0;
const base_json_repository_1 = require("./base-json-repository");
/**
 * JSON implementation for Village repository.
 */
class JSONVillageRepository extends base_json_repository_1.BaseJSONRepository {
    constructor(data) {
        super(data);
    }
    findByDistrictCode(districtCode) {
        return this.data.filter(v => v.districtCode === districtCode);
    }
}
exports.JSONVillageRepository = JSONVillageRepository;
