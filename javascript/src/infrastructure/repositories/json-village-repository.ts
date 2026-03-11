import { Village } from "../../core/entities/village";
import { VillageRepository } from "../../core/interfaces/village-repository";
import { BaseJSONRepository } from "./base-json-repository";

/**
 * JSON implementation for Village repository.
 */
export class JSONVillageRepository extends BaseJSONRepository<Village> implements VillageRepository {
  constructor(data: Village[]) {
    super(data);
  }

  findByDistrictCode(districtCode: string): Village[] {
    return this.data.filter(v => v.districtCode === districtCode);
  }
}
