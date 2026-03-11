import { AdministrativeUnit, VillageType } from "./administrative-unit";
/**
 * Village entity.
 */
export declare class Village extends AdministrativeUnit {
    readonly districtCode: string;
    readonly type: VillageType;
    constructor(code: string, name: string, districtCode: string, type: VillageType);
}
//# sourceMappingURL=village.d.ts.map