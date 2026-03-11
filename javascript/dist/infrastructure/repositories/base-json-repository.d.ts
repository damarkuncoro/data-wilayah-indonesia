import { Repository } from "../../core/interfaces/repository";
/**
 * Base implementation for JSON-based repositories.
 * Follows DRY principles.
 */
export declare abstract class BaseJSONRepository<T extends {
    code: string;
    name: string;
}> implements Repository<T> {
    protected readonly data: T[];
    constructor(data: T[]);
    getAll(): T[];
    getByCode(code: string): T | undefined;
    findByName(name: string): T[];
}
//# sourceMappingURL=base-json-repository.d.ts.map