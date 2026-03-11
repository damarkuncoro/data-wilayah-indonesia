"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataWilayahService = void 0;
const json_province_repository_1 = require("./infrastructure/repositories/json-province-repository");
const json_regency_repository_1 = require("./infrastructure/repositories/json-regency-repository");
const json_district_repository_1 = require("./infrastructure/repositories/json-district-repository");
const json_village_repository_1 = require("./infrastructure/repositories/json-village-repository");
// Load data (In a real package, this might be handled by a factory or dependency injection)
const provinces_json_1 = __importDefault(require("@damarkuncoro/data-wilayah-indonesia/data/provinces.json"));
const regencies_json_1 = __importDefault(require("@damarkuncoro/data-wilayah-indonesia/data/regencies.json"));
const districts_json_1 = __importDefault(require("@damarkuncoro/data-wilayah-indonesia/data/districts.json"));
const villages_json_1 = __importDefault(require("@damarkuncoro/data-wilayah-indonesia/data/villages.json"));
/**
 * DataWilayahService - Facade class for Data Wilayah Indonesia.
 * Follows Clean Architecture (Composition Root) with Lazy Initialization.
 */
class DataWilayahService {
    constructor() { }
    get provinceRepo() {
        if (!this._provinceRepo) {
            this._provinceRepo = new json_province_repository_1.JSONProvinceRepository(provinces_json_1.default);
        }
        return this._provinceRepo;
    }
    get regencyRepo() {
        if (!this._regencyRepo) {
            this._regencyRepo = new json_regency_repository_1.JSONRegencyRepository(regencies_json_1.default);
        }
        return this._regencyRepo;
    }
    get districtRepo() {
        if (!this._districtRepo) {
            this._districtRepo = new json_district_repository_1.JSONDistrictRepository(districts_json_1.default);
        }
        return this._districtRepo;
    }
    get villageRepo() {
        if (!this._villageRepo) {
            this._villageRepo = new json_village_repository_1.JSONVillageRepository(villages_json_1.default);
        }
        return this._villageRepo;
    }
    /**
     * Get all provinces.
     */
    getAllProvinces() {
        return this.provinceRepo.getAll();
    }
    /**
     * Get all regencies.
     */
    getAllRegencies() {
        return this.regencyRepo.getAll();
    }
    /**
     * Get all districts.
     */
    getAllDistricts() {
        return this.districtRepo.getAll();
    }
    /**
     * Get all villages.
     */
    getAllVillages() {
        return this.villageRepo.getAll();
    }
    /**
     * Get regencies by province code.
     */
    getRegenciesByProvince(provinceCode) {
        return this.regencyRepo.findByProvinceCode(provinceCode);
    }
    /**
     * Get districts by regency code.
     */
    getDistrictsByRegency(regencyCode) {
        return this.districtRepo.findByRegencyCode(regencyCode);
    }
    /**
     * Get villages by district code.
     */
    getVillagesByDistrict(districtCode) {
        return this.villageRepo.findByDistrictCode(districtCode);
    }
    /**
     * Get province by code.
     */
    getProvinceByCode(code) {
        return this.provinceRepo.getByCode(code);
    }
    /**
     * Find provinces by name.
     */
    findProvincesByName(name) {
        return this.provinceRepo.findByName(name);
    }
    /**
     * Global search for any administrative unit by name.
     */
    search(name) {
        const results = [];
        this.provinceRepo.findByName(name).forEach(p => results.push({ type: 'PROVINCE', item: p }));
        this.regencyRepo.findByName(name).forEach(r => results.push({ type: 'REGENCY', item: r }));
        this.districtRepo.findByName(name).forEach(d => results.push({ type: 'DISTRICT', item: d }));
        this.villageRepo.findByName(name).forEach(v => results.push({ type: 'VILLAGE', item: v }));
        return results;
    }
}
exports.DataWilayahService = DataWilayahService;
// Re-export types for convenience
__exportStar(require("./core/entities/administrative-unit"), exports);
__exportStar(require("./core/entities/province"), exports);
__exportStar(require("./core/entities/regency"), exports);
__exportStar(require("./core/entities/district"), exports);
__exportStar(require("./core/entities/village"), exports);
