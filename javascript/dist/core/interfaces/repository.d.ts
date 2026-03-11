/**
 * Generic repository interface.
 * Follows SOLID principles (ISP, DIP).
 */
export interface Repository<T> {
    getAll(): T[];
    getByCode(code: string): T | undefined;
    findByName(name: string): T[];
}
//# sourceMappingURL=repository.d.ts.map