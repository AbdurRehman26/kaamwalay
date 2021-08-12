import { PaginationLinks } from '@shared/classes/PaginationLinks';
import { PaginationMeta } from '@shared/classes/PaginationMeta';

export class PaginatedData<T> {
    public data!: T[];
    public links!: PaginationLinks;
    public meta!: PaginationMeta;

    static from<T>(data: T[], links?: PaginationLinks, meta?: PaginationMeta) {
        const pagination = new PaginatedData();
        pagination.data = data;
        pagination.links = links ?? new PaginationLinks();
        pagination.meta = meta ?? new PaginationMeta();
        return pagination;
    }
}
