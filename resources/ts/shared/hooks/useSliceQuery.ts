import { ClassConstructor, plainToClass } from 'class-transformer';
import { useEffect, useMemo } from 'react';

import { listOrdersAction } from '../redux/slices/ordersSlice';
import { GlobalStateType } from '../redux/store';
import { APIState } from '../types/APIState';
import { useSharedSelector } from './useSharedDispatch';
import { useSharedDispatch } from './useSharedSelector';

export function useSliceQuery<E, A = any, R extends APIState<E> = APIState<E>, S = GlobalStateType>(
    action: A,
    entity: ClassConstructor<E>,
    selector: (state: S) => R,
) {
    const dispatch = useSharedDispatch();
    const entities = useSharedSelector((state) => selector(state as any).entities);
    const ids = useSharedSelector((state) => selector(state as any).ids);
    const pagination = useSharedSelector((state) => selector(state as any).pagination);
    const error = useSharedSelector((state) => selector(state as any).errors.list);
    const isLoading = useSharedSelector((state) => selector(state as any).isLoading);
    const isError = !!error;

    const data = useMemo(() => {
        const list = ids.map((id) => entities[id]);
        return plainToClass(entity, list);
    }, [ids, entities]);

    useEffect(() => {
        dispatch(listOrdersAction());
    }, []);

    return useMemo(
        () => ({
            isLoading,
            isError,
            data,
            pagination,
        }),
        [isLoading, isError, data, pagination],
    );
}
