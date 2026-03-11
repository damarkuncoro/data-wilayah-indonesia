"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseJSONRepository = void 0;
/**
 * Base implementation for JSON-based repositories.
 * Follows DRY principles.
 */
class BaseJSONRepository {
    constructor(data) {
        this.data = data;
    }
    getAll() {
        return this.data;
    }
    getByCode(code) {
        return this.data.find(item => item.code === code);
    }
    findByName(name) {
        const lowerName = name.toLowerCase();
        return this.data.filter(item => item.name.toLowerCase().includes(lowerName));
    }
}
exports.BaseJSONRepository = BaseJSONRepository;
