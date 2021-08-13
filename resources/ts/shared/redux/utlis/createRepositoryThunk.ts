import { ActionReducerMapBuilder, AsyncThunk, createAsyncThunk, CreateSliceOptions } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, classToPlain } from 'class-transformer';
import { uniq } from 'lodash-es';

import { PaginatedData } from '@shared/classes/PaginatedData';
import { Entity } from '@shared/entities/Entity';
import { app } from '@shared/lib/app';
import { Repository } from '@shared/repositories/Repository';
import { APIState } from '@shared/types/APIState';
import { ShowTuple } from '@shared/types/ShowTuple';

import { serializeDataList } from './serializeDataList';

interface CreateRepositoryThunk<N extends string, E> {
    name: N;
    listAction: AsyncThunk<PaginatedData<E>, AxiosRequestConfig | undefined, any>;
    showAction: AsyncThunk<E, ShowTuple, any>;
    initialState: APIState<E>;
    buildReducers(builder: ActionReducerMapBuilder<APIState<E>>): void;
}

export function createRepositoryThunk<
    N extends string,
    E extends Entity = Entity,
    R extends Repository<E> = Repository<E>,
>(name: N, repository: ClassConstructor<R>): CreateRepositoryThunk<N, E> {
    const initialState: APIState<E> = {
        isLoading: {},
        entities: {},
        ids: [],
        pagination: {},
        errors: {},
    };

    const listAction = createAsyncThunk(name + '/list', async (config?: AxiosRequestConfig) => {
        const repo = app(repository);
        const data = await repo.list(config);
        return classToPlain(data) as PaginatedData<E>;
    });

    const showAction = createAsyncThunk(name + '/show', async (args: ShowTuple) => {
        const repo = app(repository);
        const data = await repo.show(...args);
        return classToPlain(data) as E;
    });

    const buildReducers: CreateSliceOptions<APIState<E>, {}, N>['extraReducers'] = (builder) => {
        builder
            .addCase(listAction.pending, (state) => {
                state.errors.list = null;
                state.isLoading.list = true;
            })
            .addCase(listAction.rejected, (state, { error }) => {
                state.errors.list = error;
                state.isLoading.list = false;
            })
            .addCase(listAction.fulfilled, (state, { payload }) => {
                const { data, meta, links } = payload;
                const { entities, ids } = serializeDataList(data);
                state.ids = uniq([...state.ids, ...ids]);
                state.entities = { ...state.entities, ...entities };
                state.pagination.links = links;
                state.pagination.meta = meta;
                state.isLoading.list = false;
            });

        builder
            .addCase(showAction.pending, (state, { meta }) => {
                const id = meta.arg[0];
                state.errors[`show_${id}`] = null;
                state.isLoading[id] = true;
            })
            .addCase(showAction.rejected, (state, { error, meta }) => {
                const id = meta.arg[0];
                state.errors[`show_${id}`] = error;
                state.isLoading[id] = false;
            })
            .addCase(showAction.fulfilled, (state, { payload }) => {
                const { id } = payload;
                state.ids.push(id);
                state.entities[id] = payload as any;
                state.isLoading[id] = false;
            });
    };

    return {
        name,
        listAction,
        showAction,
        initialState,
        buildReducers,
    };
}
