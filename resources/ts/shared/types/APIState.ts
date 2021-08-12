import { PaginatedData } from '../classes/PaginatedData';

export interface APIState<T> {
    errors: Record<string, Error | null | string>;
    isLoading: boolean;
    entities: Record<number, T>;
    ids: number[];
    pagination: Partial<Omit<PaginatedData<any>, 'data'>>;
}
