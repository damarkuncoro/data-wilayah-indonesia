import { Repository } from "../../core/interfaces/repository";

/**
 * Base implementation for JSON-based repositories.
 * Follows DRY principles.
 */
export abstract class BaseJSONRepository<T extends { code: string; name: string }> implements Repository<T> {
  private readonly codeIndex: Map<string, T> = new Map();

  constructor(protected readonly data: T[]) {
    this.data.forEach(item => {
      this.codeIndex.set(item.code, item);
    });
  }

  getAll(): T[] {
    return this.data;
  }

  getByCode(code: string): T | undefined {
    return this.codeIndex.get(code);
  }

  findByName(name: string): T[] {
    const lowerName = name.toLowerCase();
    return this.data.filter(item => item.name.toLowerCase().includes(lowerName));
  }
}
