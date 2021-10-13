import { TablePaginationProps } from '@mui/material/TablePagination';
import { AsyncThunk } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, plainToClass } from 'class-transformer';
import { useCallback, useEffect, useMemo } from 'react';
import { PaginatedData } from '../classes/PaginatedData';
import { GlobalStateType } from '../redux/store';
import { APIService } from '../services/APIService';
import { APIState } from '../types/APIState';
import { useInjectable } from './useInjectable';
import { useSharedDispatch } from './useSharedDispatch';
import { useSharedSelector } from './useSharedSelector';

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
    const perPage = Number(pagination.meta?.perPage ?? PaginatedData.LimitSet[0]);
    const lastPage = pagination.meta?.lastPage ?? 1;

    const data = useMemo(() => {
        const list = ids.map((id: number) => entities[id]);
        // if (perPage) {
        //     const offset = (currentPage - 1) * perPage;
        //     list = list.slice(offset, offset + perPage);
        // }

        return plainToClass(entity, list);
    }, [ids, entity, entities]);

    const fetch = useCallback(
        async function fetch(config?: AxiosRequestConfig) {
            const baseConfig = {
                params: {
                    page: currentPage,
                    perPage: perPage,
                },
            };

            return dispatch(action(apiService.mergeConfig(baseConfig, config, actionArg)));
        },
        [currentPage, perPage, dispatch, action, apiService, actionArg],
    );

    const getPage = useCallback(
        async function getPage(pageNumber?: number) {
            const params: Record<string, any> = {};
            if (pageNumber) {
                // Ensure that the requested page will be never bigger than the last page, or lower than 1.
                params.page = Math.min(lastPage, Math.max(1, pageNumber));
            }

            await fetch({ params });
        },
        [fetch, lastPage],
    );

    const nextPage = useCallback(
        async function nextPage() {
            await getPage(currentPage + 1);
        },
        [getPage, currentPage],
    );

    const previousPage = useCallback(
        async function previousPage() {
            await getPage(currentPage - 1);
        },
        [getPage, currentPage],
    );

    const search = useCallback((filter: Record<string, any>) => fetch({ params: { filter } }), [fetch]);

    const sort = useCallback((sortFilter: Record<string, any>) => fetch({ params: { sort: sortFilter } }), [fetch]);

    const searchSorted = useCallback(
        (sortFilter: Record<string, any>, searchFilter: Record<string, any>) =>
            fetch({ params: { sort: sortFilter, filter: searchFilter } }),
        [fetch],
    );

    const handleChangePage = useCallback(
        async function handleChangePage(e, page: number) {
            await getPage(page + 1);
        },
        [getPage],
    );

    const handleChangeRowsPerPage = useCallback(
        async function handleChangeRowsPerPage(e) {
            await fetch({
                params: {
                    perPage: e.target.value,
                },
            });
        },
        [fetch],
    );

    useEffect(
        () => {
            // noinspection JSIgnoredPromiseFromCall
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
            search,
            sort,
            searchSorted,
            paginationProps: {
                count: pagination.meta?.total || 0,
                page: currentPage - 1,
                rowsPerPage: Number(perPage),
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
            sort,
            searchSorted,
            search,
            currentPage,
            perPage,
            handleChangePage,
            handleChangeRowsPerPage,
        ],
    );
}
