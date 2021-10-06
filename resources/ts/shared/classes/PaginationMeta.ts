import { Type } from 'class-transformer';
import { PaginationLink } from '@shared/classes/PaginationLink';
import { Field } from '@shared/decorators/Field';

export class PaginationMeta {
    @Type(() => PaginationLink)
    public links!: PaginationLink[];
    public from!: number;
    public path!: string;
    public to!: number;
    public total!: number;

    @Field('current_page')
    public currentPage!: number;

    @Field('last_page')
    public lastPage!: number;

    @Field('per_page')
    public perPage!: number;
}
