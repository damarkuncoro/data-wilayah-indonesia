import { AdministrativeUnit, RegencyType } from "./administrative-unit";

/**
 * Regency/City entity.
 */
export class Regency extends AdministrativeUnit {
  constructor(
    code: string,
    name: string,
    public readonly provinceCode: string,
    public readonly type: RegencyType
  ) {
    super(code, name);
    if (!provinceCode) throw new Error("Province code cannot be empty.");
  }
}
