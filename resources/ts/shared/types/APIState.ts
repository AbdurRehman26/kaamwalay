import { SerializedError } from '@reduxjs/toolkit';

import { PaginatedData } from '../classes/PaginatedData';

export interface APIState<T> {
    errors: Record<string, SerializedError | Error | null | string>;
    isLoading: Record<string, boolean>;
    entities: Record<number, T>;
    ids: number[];
    pagination: Partial<Omit<PaginatedData<any>, 'data'>>;
}
