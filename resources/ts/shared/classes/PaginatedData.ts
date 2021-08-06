import { PaginationLinks } from '@shared/classes/PaginationLinks';
import { PaginationMeta } from '@shared/classes/PaginationMeta';

export class PaginatedData<T> {
    public data!: T[];
    public links!: PaginationLinks;
    public meta!: PaginationMeta;
}
