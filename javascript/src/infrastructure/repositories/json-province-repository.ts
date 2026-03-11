import { Province } from "../../core/entities/province";
import { ProvinceRepository } from "../../core/interfaces/province-repository";
import { BaseJSONRepository } from "./base-json-repository";

/**
 * JSON implementation for Province repository.
 */
export class JSONProvinceRepository extends BaseJSONRepository<Province> implements ProvinceRepository {
  constructor(data: Province[]) {
    super(data);
  }
}
