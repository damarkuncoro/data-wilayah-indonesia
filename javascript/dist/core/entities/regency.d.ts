import { AdministrativeUnit, RegencyType } from "./administrative-unit";
/**
 * Regency/City entity.
 */
export declare class Regency extends AdministrativeUnit {
    readonly provinceCode: string;
    readonly type: RegencyType;
    constructor(code: string, name: string, provinceCode: string, type: RegencyType);
}
//# sourceMappingURL=regency.d.ts.map