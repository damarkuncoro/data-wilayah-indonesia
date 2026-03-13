import { AdministrativeUnit, VillageType } from "./administrative-unit";

/**
 * Village entity.
 */
export class Village extends AdministrativeUnit {
  constructor(
    code: string,
    name: string,
    public readonly districtCode: string,
    public readonly type: VillageType
  ) {
    super(code, name);
    if (!districtCode) throw new Error("District code cannot be empty.");
  }
}
