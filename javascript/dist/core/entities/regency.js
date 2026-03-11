import { AdministrativeUnit } from "./administrative-unit";
/**
 * Regency/City entity.
 */
export class Regency extends AdministrativeUnit {
    constructor(code, name, provinceCode, type) {
        super(code, name);
        this.provinceCode = provinceCode;
        this.type = type;
        if (!provinceCode)
            throw new Error("Province code cannot be empty.");
    }
}
