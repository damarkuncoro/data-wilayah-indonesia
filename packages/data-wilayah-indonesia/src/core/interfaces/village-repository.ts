import { Village } from '../entities';
import { Repository } from "./repository";

/**
 * Interface specifically for Village repository.
 */
export interface VillageRepository extends Repository<Village> {
  findByDistrictCode(districtCode: string): Village[];
}
