import { Type, plainToInstance } from 'class-transformer';
import { PaginationLinks } from './PaginationLinks';
import { PaginationMeta } from './PaginationMeta';

export class PaginatedData<T> {
    static LimitSet = [24, 48, 72, 96, 120];

    public data!: T[];

    @Type()
    public links!: PaginationLinks;
    @Type()
    public meta!: PaginationMeta;

    static from<T>(data: T[], links?: PaginationLinks, meta?: PaginationMeta): PaginatedData<T> {
        const pagination = new PaginatedData<T>();
        pagination.data = data;
        pagination.links = links ?? new PaginationLinks();
        pagination.meta = meta ?? new PaginationMeta();

        // noinspection SuspiciousTypeOfGuard
        if (!(pagination.links instanceof PaginationLinks)) {
            pagination.links = plainToInstance(PaginationLinks, pagination.links as any);
        }

        // noinspection SuspiciousTypeOfGuard
        if (!(pagination.meta instanceof PaginationMeta)) {
            pagination.meta = plainToInstance(PaginationMeta, pagination.meta as any);
        }

        return pagination;
    }

    static fromPaginatedData(paginatedData: Partial<PaginatedData<any>>) {
        return this.from(paginatedData.data ?? [], paginatedData.links, paginatedData.meta);
    }
}
