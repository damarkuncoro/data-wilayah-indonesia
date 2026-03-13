import { AdministrativeUnit } from "./administrative-unit";

/**
 * Province entity.
 */
export class Province extends AdministrativeUnit {
  constructor(code: string, name: string) {
    super(code, name);
  }
}
