import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain } from 'class-transformer';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrdersRepository } from '@shared/repositories/OrdersRepository';
import { ChangeOrderShipmentDto } from '../../dto/ChangeOrderShipmentDto';
import { ShipmentEntity } from '../../entities/ShipmentEntity';
import { app } from '../../lib/app';
import { NotificationsService } from '../../services/NotificationsService';
import { APIState } from '../../types/APIState';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const ordersThunk = createRepositoryThunk('orders', OrdersRepository);

export const setOrderCustomerShipment = createAsyncThunk<
    {
        orderCustomerShipment: ShipmentEntity;
        orderId: number;
    },
    ChangeOrderShipmentDto
>('setOrderCustomerShipment', async (input: ChangeOrderShipmentDto, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);
    try {
        const orderCustomerShipment = await ordersRepository.setCustomerShipment(input);

        return {
            orderCustomerShipment: instanceToPlain(orderCustomerShipment) as ShipmentEntity,
            orderId: input.orderId,
        };
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e as Error);
    }
});

export const deleteOrder = createAsyncThunk('deleteOrder', async (orderId: number, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);
    try {
        await ordersRepository.deleteOrder(orderId);
        return {};
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e as Error);
    }
});

export const ordersSlice = createSlice({
    name: ordersThunk.name,
    initialState: {
        ...ordersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateOrders: ordersThunk.invalidateEntities,
    },
    extraReducers(builder) {
        ordersThunk.buildReducers(builder);

        builder.addCase(setOrderCustomerShipment.fulfilled, (state, { payload }) => {
            if (state.entities[payload.orderId]) {
                state.entities[payload.orderId].orderCustomerShipment = payload.orderCustomerShipment;
            }
        });
    },
});
export const { invalidateOrders } = ordersSlice.actions;
export const { listAction: listOrdersAction, showAction: showOrderAction } = ordersThunk;
