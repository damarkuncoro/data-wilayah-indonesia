import { Repository } from "../../core/interfaces/repository";

/**
 * Base implementation for JSON-based repositories.
 * Follows DRY principles.
 */
export abstract class BaseJSONRepository<T extends { code: string; name: string }> implements Repository<T> {
  constructor(protected readonly data: T[]) {}

  getAll(): T[] {
    return this.data;
  }

  getByCode(code: string): T | undefined {
    return this.data.find(item => item.code === code);
  }

  findByName(name: string): T[] {
    const lowerName = name.toLowerCase();
    return this.data.filter(item => item.name.toLowerCase().includes(lowerName));
  }
}
