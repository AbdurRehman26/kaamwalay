import { TablePaginationProps } from '@material-ui/core/TablePagination';
import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { useCallback, useEffect, useMemo } from 'react';
import { PaginatedData } from '../classes/PaginatedData';
import { GlobalStateType } from '../redux/store';
import { APIService } from '../services/APIService';
import { APIState } from '../types/APIState';
import { useInjectable } from './useInjectable';
import { useSharedSelector } from './useSharedDispatch';
import { useSharedDispatch } from './useSharedSelector';

export function useListQuery<
    E,
    A extends AsyncThunk<any, AxiosRequestConfig | void | undefined, any>,
    R extends APIState<E> = APIState<E>,
    S = GlobalStateType,
>(action: A, entity: ClassConstructor<E>, selector: (state: S) => R, actionArg?: AxiosRequestConfig) {
    const dispatch = useSharedDispatch();
    const apiService = useInjectable(APIService);
    const entities = useSharedSelector((state) => selector(state as any).entities);
    const ids = useSharedSelector((state) => selector(state as any).ids);
    const pagination$ = useSharedSelector((state) => selector(state as any).pagination);
    const error = useSharedSelector((state) => selector(state as any).errors.list);
    const isLoading = useSharedSelector((state) => selector(state as any).isLoading.list);
    const pagination = useMemo<PaginatedData<any>>(() => PaginatedData.fromPaginatedData(pagination$), [pagination$]);
    const isError = !!error;

    const currentPage = pagination.meta?.currentPage ?? 1;
    const perPage = pagination.meta?.perPage ?? PaginatedData.LimitSet[0];
    const lastPage = pagination.meta?.lastPage ?? 1;

    const data = useMemo(() => {
        let list = ids.map((id) => entities[id]);
        if (perPage) {
            const offset = (currentPage - 1) * perPage;
            list = list.slice(offset, offset + perPage);
        }

        return plainToClass(entity, list);
    }, [ids, perPage, entity, entities, currentPage]);

    const fetch = useCallback(
        function fetch(config?: AxiosRequestConfig) {
            const baseConfig = {
                params: {
                    page: currentPage,
                    per_page: perPage,
                },
            };

            dispatch(action(apiService.mergeConfig(baseConfig, config, actionArg)));
        },
        [currentPage, perPage, dispatch, action, apiService, actionArg],
    );

    const getPage = useCallback(
        function getPage(pageNumber?: number) {
            const params: Record<string, any> = {};
            if (pageNumber) {
                // Ensure that the requested page will be never bigger than the last page, or lower than 1.
                params.page = Math.min(lastPage, Math.max(1, pageNumber));
            }
            fetch({ params });
        },
        [fetch, lastPage],
    );

    const nextPage = useCallback(
        function nextPage() {
            getPage(currentPage + 1);
        },
        [getPage, currentPage],
    );

    const previousPage = useCallback(
        function previousPage() {
            getPage(currentPage - 1);
        },
        [getPage, currentPage],
    );

    const handleChangePage = useCallback(
        function handleChangePage(e, page: number) {
            getPage(page + 1);
        },
        [getPage],
    );

    const handleChangeRowsPerPage = useCallback(
        function handleChangeRowsPerPage(e) {
            fetch({
                params: {
                    per_page: e.target.value,
                },
            });
        },
        [fetch],
    );

    useEffect(
        () => {
            getPage();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return useMemo(
        () => ({
            isLoading: isLoading || typeof isLoading === 'undefined',
            isError,
            data,
            pagination,
            getPage,
            nextPage,
            previousPage,
            paginationProps: {
                count: pagination.meta?.total || 0,
                page: currentPage - 1,
                rowsPerPage: perPage,
                onPageChange: handleChangePage,
                onRowsPerPageChange: handleChangeRowsPerPage,
                rowsPerPageOptions: PaginatedData.LimitSet,
            } as TablePaginationProps,
        }),
        [
            isLoading,
            isError,
            data,
            pagination,
            getPage,
            nextPage,
            previousPage,
            currentPage,
            perPage,
            handleChangePage,
            handleChangeRowsPerPage,
        ],
    );
}
