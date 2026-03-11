import { District } from "../entities/district";
import { Repository } from "./repository";

/**
 * Interface specifically for District repository.
 */
export interface DistrictRepository extends Repository<District> {
  findByRegencyCode(regencyCode: string): District[];
}
