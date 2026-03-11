import { AdministrativeUnit } from "./administrative-unit";
/**
 * Village entity.
 */
export class Village extends AdministrativeUnit {
    constructor(code, name, districtCode, type) {
        super(code, name);
        this.districtCode = districtCode;
        this.type = type;
        if (!districtCode)
            throw new Error("District code cannot be empty.");
    }
}
