import { Expose } from 'class-transformer';

import { PaginationLink } from '@shared/classes/PaginationLink';

export class PaginationMeta {
    public from!: number;
    public links!: PaginationLink[];
    public path!: string;
    public to!: number;
    public total!: number;

    @Expose({ name: 'current_page' })
    public currentPage!: number;

    @Expose({ name: 'last_page' })
    public lastPage!: number;

    @Expose({ name: 'per_page' })
    public perPage!: number;
}
