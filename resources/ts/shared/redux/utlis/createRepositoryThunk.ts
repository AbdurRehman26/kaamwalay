import { ActionReducerMapBuilder, AsyncThunk, createAsyncThunk, CreateSliceOptions } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { ClassConstructor, instanceToPlain } from 'class-transformer';
import { uniq } from 'lodash';
import { PaginatedData } from '@shared/classes/PaginatedData';
import { Entity } from '@shared/entities/Entity';
import { app } from '@shared/lib/app';
import { normalizeError } from '@shared/lib/errors/normalizeError';
import { Repository } from '@shared/repositories/Repository';
import { APIState } from '@shared/types/APIState';
import { ThunkShowActionArg } from '../../types/ThunkShowActionArg';
import { serializeDataList } from './serializeDataList';

interface CreateRepositoryThunk<N extends string, E> {
    name: N;
    listAction: AsyncThunk<PaginatedData<E>, AxiosRequestConfig | void | undefined, any>;
    showAction: AsyncThunk<E, ThunkShowActionArg, any>;
    initialState: APIState<E>;

    invalidateEntities(state: APIState<E>): void;

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

    const listAction = createAsyncThunk<PaginatedData<E>, void | undefined | AxiosRequestConfig>(
        name + '/list',
        async (config, thunkAPI) => {
            const repo = app(repository);
            try {
                const data = await repo.list(config || {});
                return instanceToPlain(data) as PaginatedData<E>;
            } catch (e: any) {
                return thunkAPI.rejectWithValue(e);
            }
        },
    );

    const showAction = createAsyncThunk<E, ThunkShowActionArg>(
        name + '/show',
        async (args: ThunkShowActionArg, thunkAPI) => {
            const repo = app(repository);
            try {
                const data = await repo.show(args.resourceId, args.config);
                return instanceToPlain(data) as E;
            } catch (e: any) {
                return thunkAPI.rejectWithValue(e);
            }
        },
    );

    const buildReducers: CreateSliceOptions<APIState<E>, {}, N>['extraReducers'] = (builder) => {
        builder
            .addCase(listAction.pending, (state) => {
                state.errors.list = null;
                state.isLoading.list = true;
            })
            .addCase(listAction.rejected, (state, { error, payload }) => {
                state.errors.list = normalizeError((payload as Error) || error);
                state.isLoading.list = false;
            })
            .addCase(listAction.fulfilled, (state, { payload }) => {
                const { data, meta, links } = payload;
                const { entities, ids } = serializeDataList(data);
                state.ids = uniq([...ids]);
                state.entities = { ...entities } as any;
                state.pagination.links = links;
                state.pagination.meta = meta;
                state.isLoading.list = false;
            });

        builder
            .addCase(showAction.pending, (state, { meta }) => {
                const id = meta.arg.resourceId;
                const skipLoading = meta.arg.skipLoading;
                state.errors[`show_${id}`] = null;
                if (!skipLoading) {
                    state.isLoading[id] = true;
                }
            })
            .addCase(showAction.rejected, (state, { error, payload, meta }) => {
                const id = meta.arg.resourceId;
                state.errors[`show_${id}`] = normalizeError((payload as Error) || error);
                state.isLoading[id] = false;
            })
            .addCase(showAction.fulfilled, (state, { payload }) => {
                const { id } = payload;
                state.ids.push(id);
                state.entities[id] = payload as any;
                state.isLoading[id] = false;
            });
    };

    const invalidateEntities = (state: APIState<E>) => {
        state.entities = {};
        state.ids = [];
    };

    return {
        name,
        listAction,
        showAction,
        initialState,
        invalidateEntities,
        buildReducers,
    };
}
