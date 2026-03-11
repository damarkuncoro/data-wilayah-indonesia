import { AdministrativeUnit } from "./administrative-unit";
/**
 * District entity.
 */
export class District extends AdministrativeUnit {
    constructor(code, name, regencyCode) {
        super(code, name);
        this.regencyCode = regencyCode;
        if (!regencyCode)
            throw new Error("Regency code cannot be empty.");
    }
}
