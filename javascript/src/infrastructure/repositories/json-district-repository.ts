import { District } from '../../core/entities';
import { DistrictRepository } from "../../core/interfaces/district-repository";
import { BaseJSONRepository } from "./base-json-repository";

/**
 * JSON implementation for District repository.
 */
export class JSONDistrictRepository extends BaseJSONRepository<District> implements DistrictRepository {
  constructor(data: District[]) {
    super(data);
  }

  findByRegencyCode(regencyCode: string): District[] {
    return this.data.filter(d => d.regencyCode === regencyCode);
  }
}
