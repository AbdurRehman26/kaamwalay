import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { useCallback, useEffect, useMemo } from 'react';

import { GlobalStateType } from '../redux/store';
import { APIService } from '../services/APIService';
import { APIState } from '../types/APIState';
import { ShowTuple } from '../types/ShowTuple';
import { useInjectable } from './useInjectable';
import { useSharedSelector } from './useSharedDispatch';
import { useSharedDispatch } from './useSharedSelector';

export function useShowQuery<
    E,
    A extends AsyncThunk<any, ShowTuple, any>,
    R extends APIState<E> = APIState<E>,
    S = GlobalStateType,
>(action: A, entity: ClassConstructor<E>, selector: (state: S) => R, ...args: ShowTuple) {
    const [resourceId, config] = args;
    const dispatch = useSharedDispatch();
    const apiService = useInjectable(APIService);

    const error = useSharedSelector((state) => selector(state as any).errors[`show_${resourceId}`]);
    const isLoading = useSharedSelector((state) => selector(state as any).isLoading[resourceId]);
    const entities = useSharedSelector((state) => selector(state as any).entities);

    const data = useMemo(() => plainToClass(entity, entities[resourceId as any]), [entities, entity, resourceId]);

    const request = useCallback(
        function request(requestConfig?: AxiosRequestConfig) {
            dispatch(action([resourceId, apiService.mergeConfig(config, requestConfig)]));
        },
        [dispatch, action, resourceId, apiService, config],
    );

    useEffect(
        () => {
            request();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return useMemo(
        () => ({
            data,
            error,
            isLoading: isLoading || typeof isLoading === 'undefined',
            isError: !!error,
        }),
        [data, error, isLoading],
    );
}
