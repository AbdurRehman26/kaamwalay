import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { app } from '@shared/lib/app';
import { NotificationsService } from '@shared/services/NotificationsService';
import { CardLabelEntity } from '../../entities/CardLabelEntity';
import { OrderLabelsRepository } from '../../repositories/Admin/OrderLabelsRepository';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<CardLabelEntity> {}

const adminOrderLabelsThunk = createRepositoryThunk('adminOrderLabels', OrderLabelsRepository);

export const storeOrderLabel = createAsyncThunk('storeOrderLabel', async (input, thunkAPI) => {
    const orderLabelsRepository = app(OrderLabelsRepository);

    try {
        const customer: CardLabelEntity = await orderLabelsRepository.storeOrderLabel(input);
        NotificationsService.success('OrderLabel updated successfully!');
        return instanceToPlain(customer);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const adminOrderLabelsSlice = createSlice({
    name: adminOrderLabelsThunk.name,
    initialState: {
        ...adminOrderLabelsThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminOrderLabels: adminOrderLabelsThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminOrderLabelsThunk.buildReducers(builder);
    },
});

export const { invalidateAdminOrderLabels } = adminOrderLabelsSlice.actions;
export const { listAction: listAdminOrderLabelsAction, showAction: showAdminOrderLabelAction } = adminOrderLabelsThunk;
