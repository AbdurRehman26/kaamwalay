import { Type } from 'class-transformer';
import { PaginationLink } from '@shared/classes/PaginationLink';

export class PaginationMeta {
    @Type(() => PaginationLink)
    public links!: PaginationLink[];
    public from!: number;
    public path!: string;
    public to!: number;
    public total!: number;
    public currentPage!: number;
    public lastPage!: number;
    public perPage!: number;
}
