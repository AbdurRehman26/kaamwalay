import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { classToPlain, plainToClass } from 'class-transformer';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { ChangeOrderItemStatusDto } from '@shared/dto/ChangeOrderItemStatusDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { app } from '@shared/lib/app';
import { OrderItemsRepository } from '@shared/repositories/Admin/OrderItemsRepository';
import { OrdersRepository } from '@shared/repositories/Admin/OrdersRepository';
import { APIState } from '@shared/types/APIState';
import { AddOrderStatusHistoryDto } from '../../dto/AddOrderStatusHistoryDto';
import { ChangeOrderItemStatusBatchDto } from '../../dto/ChangeOrderItemStatusBatchDto';
import { ChangeOrderShipmentDto } from '../../dto/ChangeOrderShipmentDto';
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
        } catch (e: any) {
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
                item: classToPlain(item),
            }));
        } catch (e: any) {
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
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const addCardToOrder = createAsyncThunk('addCardToOrder', async (input: AddCardToOrderDto, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);

    try {
        const orderItem = await ordersRepository.addCard(input);
        if (!orderItem.orderId) {
            orderItem.orderId = input.orderId;
        }

        return classToPlain(orderItem);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const editCardOfOrder = createAsyncThunk('editCardOfOrder', async (input: EditCardOfOrderDto, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);

    try {
        const orderItem = await ordersRepository.editCard(input);
        if (!orderItem.orderId) {
            orderItem.orderId = input.orderId;
        }

        return classToPlain(orderItem);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const setOrderShipment = createAsyncThunk(
    'setOrderShipment',
    async (input: ChangeOrderShipmentDto, thunkAPI) => {
        const ordersRepository = app(OrdersRepository);
        try {
            const customerShipment = await ordersRepository.setShipment(input);

            return {
                shipment: classToPlain(customerShipment),
                orderId: input.orderId,
            };
        } catch (e: any) {
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

        function manageOrderAndItem(state: StateType, payload: any) {
            const orderItem = plainToClass(OrderItemEntity, payload);
            const order = plainToClass(OrderEntity, state.entities[orderItem.orderId]);
            if (order) {
                order.addItem(orderItem);
                state.entities[orderItem.orderId] = classToPlain(order) as any;
            }
        }

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
            payload.forEach(({ orderId, item, orderItemId }) => {
                const orderItem = plainToClass(OrderItemEntity, item);
                const order = plainToClass(OrderEntity, state.entities[orderId]);
                order.orderItems = (order.orderItems ?? []).map((item) => {
                    if (item.id === orderItemId) {
                        return orderItem;
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

        builder.addCase(addCardToOrder.fulfilled, (state, { payload }) => {
            manageOrderAndItem(state, payload);
        });

        builder.addCase(editCardOfOrder.fulfilled, (state, { payload }) => {
            manageOrderAndItem(state, payload);
        });

        builder.addCase(setOrderShipment.fulfilled, (state, { payload }) => {
            if (state.entities[payload.orderId]) {
                (state.entities[payload.orderId] as any).shipment = payload.shipment as any;
            }
        });
    },
});

export const { invalidateAdminOrders } = adminOrdersSlice.actions;
export const { listAction: listAdminOrdersAction, showAction: showAdminOrderAction } = adminOrdersThunk;
