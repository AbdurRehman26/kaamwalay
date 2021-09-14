import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { classToPlain, plainToClass } from 'class-transformer';
import { ChangeOrderItemStatusDto } from '@shared/dto/ChangeOrderItemStatusDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { app } from '@shared/lib/app';
import { OrderItemsRepository } from '@shared/repositories/Admin/OrderItemsRepository';
import { OrdersRepository } from '@shared/repositories/Admin/OrdersRepository';
import { APIState } from '@shared/types/APIState';
import { AddOrderStatusHistoryDto } from '../../dto/AddOrderStatusHistoryDto';
import { ChangeOrderItemStatusBatchDto } from '../../dto/ChangeOrderItemStatusBatchDto';
import { OrderItemStatusEntity } from '../../entities/OrderItemStatusEntity';
import { OrderStatusHistoryEntity } from '../../entities/OrderStatusHistoryEntity';
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
                status: classToPlain(item.status),
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
                status: classToPlain(item.status),
            }));
        } catch (e) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const addOrderStatusHistory = createAsyncThunk(
    'addOrderStatusHistory',
    async (input: AddOrderStatusHistoryDto, thunkAPI) => {
        const ordersRepository = app(OrdersRepository);

        try {
            const orderStatusHistory = await ordersRepository.addOrderStatusHistory(input);
            return classToPlain(orderStatusHistory);
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
                    item.status = plainToClass(OrderItemStatusEntity, status);
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
                        item.status = plainToClass(OrderItemStatusEntity, status);
                    }

                    return item;
                });

                state.entities[orderId] = classToPlain(order) as any;
            });
        });

        builder.addCase(addOrderStatusHistory.fulfilled, (state, { payload }) => {
            const orderStatusHistory = plainToClass(OrderStatusHistoryEntity, payload);
            const order = plainToClass(OrderEntity, state.entities[orderStatusHistory.orderId]);

            if (order) {
                order.orderStatusHistory = [...order.orderStatusHistory, orderStatusHistory];
                order.orderStatus = orderStatusHistory.orderStatus;

                state.entities[orderStatusHistory.orderId] = classToPlain(order) as any;
            }
        });
    },
});

export const { invalidateAdminOrders } = adminOrdersSlice.actions;
export const { listAction: listAdminOrdersAction, showAction: showAdminOrderAction } = adminOrdersThunk;
