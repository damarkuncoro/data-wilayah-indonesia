import { AdministrativeUnit } from "./administrative-unit";

/**
 * District entity.
 */
export class District extends AdministrativeUnit {
  constructor(
    code: string,
    name: string,
    public readonly regencyCode: string
  ) {
    super(code, name);
    if (!regencyCode) throw new Error("Regency code cannot be empty.");
  }
}
