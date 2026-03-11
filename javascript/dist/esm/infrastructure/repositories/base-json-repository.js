/**
 * Base implementation for JSON-based repositories.
 * Follows DRY principles.
 */
export class BaseJSONRepository {
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
