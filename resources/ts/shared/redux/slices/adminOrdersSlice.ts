import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { classToPlain, plainToClass } from 'class-transformer';
import { ChangeOrderItemStatusDto } from '@shared/dto/ChangeOrderItemStatusDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { app } from '@shared/lib/app';
import { OrderItemsRepository } from '@shared/repositories/Admin/OrderItemsRepository';
import { OrdersRepository } from '@shared/repositories/Admin/OrdersRepository';
import { APIState } from '@shared/types/APIState';
import { ChangeOrderItemStatusBatchDto } from '../../dto/ChangeOrderItemStatusBatchDto';
import { NotificationsService } from '../../services/NotificationsService';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const adminOrdersThunk = createRepositoryThunk('adminOrders', OrdersRepository);

export const changeOrderItemStatus = createAsyncThunk(
    'changeOrderItemStatus',
    async (input: ChangeOrderItemStatusDto, thunkAPI) => {
        const orderItemsRepository = app(OrderItemsRepository);
        try {
            const item = await orderItemsRepository.changeOrderItemStatus(input);

            return {
                orderId: input.orderId,
                orderItemId: input.orderItemId,
                status: item.status,
            };
        } catch (e) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const changeOrderItemsStatus = createAsyncThunk(
    'changeOrderItemsStatus',
    async (input: ChangeOrderItemStatusBatchDto, thunkAPI) => {
        const orderItemsRepository = app(OrderItemsRepository);
        try {
            const processedItems = await orderItemsRepository.changeOrderItemStatusBatch(input);

            return processedItems.map((item) => ({
                orderId: input.orderId,
                orderItemId: item.id,
                status: item.status,
            }));
        } catch (e) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const adminOrdersSlice = createSlice({
    name: adminOrdersThunk.name,
    initialState: {
        ...adminOrdersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminOrders: adminOrdersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        adminOrdersThunk.buildReducers(builder);

        builder.addCase(changeOrderItemStatus.fulfilled, (state, { payload }) => {
            const { orderId, orderItemId, status } = payload;
            const order = plainToClass(OrderEntity, state.entities[orderId]);

            order.orderItems = (order.orderItems ?? []).map((item) => {
                if (item.id === orderItemId) {
                    item.status = status;
                }

                return item;
            });

            state.entities[orderId] = classToPlain(order) as any;
        });

        builder.addCase(changeOrderItemsStatus.fulfilled, (state, { payload }) => {
            payload.forEach(({ orderId, status, orderItemId }) => {
                const order = plainToClass(OrderEntity, state.entities[orderId]);
                order.orderItems = (order.orderItems ?? []).map((item) => {
                    if (item.id === orderItemId) {
                        item.status = status;
                    }

                    return item;
                });

                state.entities[orderId] = classToPlain(order) as any;
            });
        });
    },
});

export const { invalidateAdminOrders } = adminOrdersSlice.actions;
export const { listAction: listAdminOrdersAction, showAction: showAdminOrderAction } = adminOrdersThunk;
