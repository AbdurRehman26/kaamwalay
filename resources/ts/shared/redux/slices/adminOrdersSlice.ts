import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { AddExtraChargeToOrderDTO } from '@shared/dto/AddExtraChargeToOrderDTO';
import { ChangeOrderItemStatusDto } from '@shared/dto/ChangeOrderItemStatusDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { EditTransactionNotesDTO } from '@shared/dto/EditTransactionNotesDTO';
import { RefundOrderTransactionDTO } from '@shared/dto/RefundOrderTransactionDTO';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderExtraChargeEntity } from '@shared/entities/OrderExtraChargeEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { OrderRefundEntity } from '@shared/entities/OrderRefundEntity';
import { app } from '@shared/lib/app';
import { OrderItemsRepository } from '@shared/repositories/Admin/OrderItemsRepository';
import { OrdersRepository } from '@shared/repositories/Admin/OrdersRepository';
import { APIState } from '@shared/types/APIState';
import { AddOrderStatusHistoryDto } from '../../dto/AddOrderStatusHistoryDto';
import { ChangeOrderItemStatusBatchDto } from '../../dto/ChangeOrderItemStatusBatchDto';
import { ChangeOrderShipmentDto } from '../../dto/ChangeOrderShipmentDto';
import { OrderItemStatusHistoryEntity } from '../../entities/OrderItemStatusHistoryEntity';
import { OrderStatusEntity } from '../../entities/OrderStatusEntity';
import { OrderStatusHistoryEntity } from '../../entities/OrderStatusHistoryEntity';
import { ShipmentEntity } from '../../entities/ShipmentEntity';
import { NotificationsService } from '../../services/NotificationsService';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';
import { ChangeOrderItemNotesDTO } from '../../dto/ChangeOrderItemNotesDTO';
import { WalletRepository } from '../../repositories/Admin/WalletRepository';
import { WalletEntity } from '../../entities/WalletEntity';

interface StateType extends APIState<OrderEntity> {}

const adminOrdersThunk = createRepositoryThunk('adminOrders', OrdersRepository);

export const changeOrderItemStatus = createAsyncThunk<
    {
        orderId: number;
        orderItemId: number;
        certificateNumber: string;
        status: OrderItemStatusHistoryEntity;
    },
    ChangeOrderItemStatusDto
>('changeOrderItemStatus', async (input: ChangeOrderItemStatusDto, thunkAPI) => {
    const orderItemsRepository = app(OrderItemsRepository);
    try {
        const item = await orderItemsRepository.changeOrderItemStatus(input);

        return {
            orderId: input.orderId,
            orderItemId: input.orderItemId,
            certificateNumber: item.certificateNumber,
            status: instanceToPlain(item.status) as OrderItemStatusHistoryEntity,
        };
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const changeOrderItemNotes = createAsyncThunk<
    {
        orderId: number;
        orderItemId: number;
        notes: string;
        internalNotes?: string;
    },
    ChangeOrderItemNotesDTO
>('changeOrderItemNotes', async (input: ChangeOrderItemNotesDTO, thunkAPI) => {
    const orderItemsRepository = app(OrderItemsRepository);
    try {
        const item = await orderItemsRepository.changeOrderItemNotes(input);

        return {
            orderId: input.orderId,
            orderItemId: input.orderItemId,
            notes: item.notes,
            internalNotes: item.internalNotes,
        };
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const changeOrderItemsStatus = createAsyncThunk<
    { orderId: number; orderItemId: number; item: OrderItemEntity }[],
    ChangeOrderItemStatusBatchDto
>('changeOrderItemsStatus', async (input: ChangeOrderItemStatusBatchDto, thunkAPI) => {
    const orderItemsRepository = app(OrderItemsRepository);
    try {
        const processedItems = await orderItemsRepository.changeOrderItemStatusBatch(input);

        return processedItems.map((item) => ({
            orderId: input.orderId,
            orderItemId: item.id,
            item: instanceToPlain(item) as OrderItemEntity,
        }));
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const addOrderStatusHistory = createAsyncThunk(
    'addOrderStatusHistory',
    async (input: AddOrderStatusHistoryDto, thunkAPI) => {
        const ordersRepository = app(OrdersRepository);

        try {
            const orderStatusHistory = await ordersRepository.addOrderStatusHistory(input);
            return instanceToPlain(orderStatusHistory);
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

        return instanceToPlain(orderItem) as OrderItemEntity;
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

        return instanceToPlain(orderItem);
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const setOrderShipment = createAsyncThunk<
    {
        orderShipment: ShipmentEntity;
        orderStatus: OrderStatusEntity;
        orderStatusHistory: OrderStatusHistoryEntity[];
        orderId: number;
    },
    ChangeOrderShipmentDto
>('setOrderShipment', async (input: ChangeOrderShipmentDto, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);
    try {
        const orderShipment = await ordersRepository.setShipment(input);
        const order = await ordersRepository.show(input.orderId, {
            params: {
                include: ['orderStatus', 'orderStatusHistory.orderStatus'],
            },
        });

        return {
            orderShipment: instanceToPlain(orderShipment) as ShipmentEntity,
            orderStatus: instanceToPlain(order.orderStatus) as OrderStatusEntity,
            orderStatusHistory: instanceToPlain(order.orderStatusHistory) as OrderStatusHistoryEntity[],
            orderId: input.orderId,
        };
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const addExtraChargeToOrder = createAsyncThunk<
    {
        extraCharge: OrderExtraChargeEntity;
        orderId: number;
    },
    AddExtraChargeToOrderDTO
>('addExtraChargeToOrder', async (input: AddExtraChargeToOrderDTO, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);

    try {
        const extraCharge = await ordersRepository.addExtraChargeToOrder(input);
        NotificationsService.success('Charged successfully!');
        setTimeout(() => {
            window.location.reload();
        }, 500);
        return {
            extraCharge: instanceToPlain(extraCharge) as OrderExtraChargeEntity,
            orderId: input.orderId,
        };
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const refundOrderTransaction = createAsyncThunk<
    {
        extraCharge: OrderRefundEntity;
        orderId: number;
    },
    RefundOrderTransactionDTO
>('refundOrderTransaction', async (input: RefundOrderTransactionDTO, thunkAPI) => {
    const ordersRepository = app(OrdersRepository);

    try {
        const refundTransaction = await ordersRepository.refundOrderTransaction(input);
        NotificationsService.success('Customer refunded successfully!');
        setTimeout(() => {
            window.location.reload();
        }, 500);
        return {
            extraCharge: instanceToPlain(refundTransaction) as OrderRefundEntity,
            orderId: input.orderId,
        };
    } catch (e: any) {
        NotificationsService.exception(e);
        return thunkAPI.rejectWithValue(e);
    }
});

export const editTransactionNotes = createAsyncThunk(
    'editTransactionNotes',
    async (input: EditTransactionNotesDTO, thunkAPI) => {
        const ordersRepository = app(OrdersRepository);

        try {
            const transaction = await ordersRepository.editTransactionNotes(input);
            return instanceToPlain({ ...transaction, transactionType: input.transactionType, orderId: input.orderId });
        } catch (e: any) {
            NotificationsService.exception(e);
            return thunkAPI.rejectWithValue(e);
        }
    },
);

export const updateOrderWalletById = createAsyncThunk('updateOrderWalletById', async (walletId: number, thunkAPI) => {
    const walletRepository = app(WalletRepository);

    try {
        // noinspection UnnecessaryLocalVariableJS
        const wallet = await walletRepository.show(walletId);

        return instanceToPlain(wallet);
    } catch (e: any) {
        return thunkAPI.rejectWithValue(e);
    }
});

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
            const orderItem = plainToInstance(OrderItemEntity, payload);
            const order = plainToInstance(OrderEntity, state.entities[orderItem.orderId]);
            if (order) {
                order.addItem(orderItem);
                state.entities[orderItem.orderId] = instanceToPlain(order) as any;
            }
        }

        builder.addCase(changeOrderItemStatus.fulfilled, (state, { payload }) => {
            const { orderId, orderItemId, certificateNumber, status } = payload;
            const order = plainToInstance(OrderEntity, state.entities[orderId]);

            order.orderItems = (order.orderItems ?? []).map((item) => {
                if (item.id === orderItemId) {
                    item.certificateNumber = certificateNumber;
                    item.status = plainToInstance(OrderItemStatusHistoryEntity, status);
                }

                return item;
            });

            state.entities[orderId] = instanceToPlain(order) as any;
        });

        builder.addCase(changeOrderItemNotes.fulfilled, (state, { payload }) => {
            const { orderId, orderItemId, notes } = payload;
            const order = plainToInstance(OrderEntity, state.entities[orderId]);

            order.orderItems = (order.orderItems ?? []).map((item) => {
                if (item.id === orderItemId) {
                    item.notes = notes;
                }
                return item;
            });

            state.entities[orderId] = instanceToPlain(order) as any;
        });

        builder.addCase(changeOrderItemsStatus.fulfilled, (state, { payload }) => {
            payload.forEach(({ orderId, item, orderItemId }) => {
                const orderItem = plainToInstance(OrderItemEntity, item);
                const order = plainToInstance(OrderEntity, state.entities[orderId]);
                order.orderItems = (order.orderItems ?? []).map((item) => {
                    if (item.id === orderItemId) {
                        return orderItem;
                    }

                    return item;
                });

                state.entities[orderId] = instanceToPlain(order) as any;
            });
        });

        builder.addCase(addOrderStatusHistory.fulfilled, (state, { payload }) => {
            const orderStatusHistory = plainToInstance(OrderStatusHistoryEntity, payload);
            const order = plainToInstance(OrderEntity, state.entities[orderStatusHistory.orderId]);

            if (order) {
                order.orderStatusHistory = [...order.orderStatusHistory, orderStatusHistory];
                order.orderStatus = orderStatusHistory.orderStatus;

                state.entities[orderStatusHistory.orderId] = instanceToPlain(order) as any;
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
                state.entities[payload.orderId].orderShipment = payload.orderShipment;
                state.entities[payload.orderId].orderStatus = payload.orderStatus;
                state.entities[payload.orderId].orderStatusHistory = payload.orderStatusHistory;
            }
        });

        builder.addCase(addExtraChargeToOrder.fulfilled, (state, { payload }) => {
            const orderId = payload.orderId;
            const orderEntity = state.entities[orderId];
            if (orderEntity) {
                orderEntity.extraCharges = [...orderEntity.extraCharges, payload.extraCharge];
                state.entities[orderId] = orderEntity;
            }
        });

        builder.addCase(refundOrderTransaction.fulfilled, (state, { payload }) => {
            const orderId = payload.orderId;
            const orderEntity = state.entities[orderId];
            if (orderEntity) {
                orderEntity.refunds = [...orderEntity.refunds, payload.extraCharge];
                state.entities[payload.orderId] = orderEntity;
            }
        });

        builder.addCase(editTransactionNotes.fulfilled, (state, { payload }) => {
            const transactionType = payload.transactionType;
            const order = plainToInstance(OrderEntity, state.entities[payload.orderId]);
            const transaction = plainToInstance(
                transactionType === 'refund' ? OrderRefundEntity : OrderExtraChargeEntity,
                payload,
            );
            if (order) {
                const transactionOrderProperty = transactionType === 'refund' ? 'refunds' : 'extraCharges';
                const existingTransactionIndex = order[transactionOrderProperty].findIndex(
                    (item) => item.id === transaction.id,
                );
                order[transactionOrderProperty][existingTransactionIndex].notes = transaction.notes as any;
                state.entities[payload.orderId] = instanceToPlain(order) as any;
            }
        });

        builder.addCase(updateOrderWalletById.fulfilled, (state, { payload }) => {
            const entities = { ...state.entities };
            Object.entries(entities).forEach(([key, value]) => {
                if (value?.customer?.wallet?.id === payload.id) {
                    entities[key as any].customer.wallet = plainToInstance(WalletEntity, payload);
                }
            });

            state.entities = entities;
        });
    },
});

export const { invalidateAdminOrders } = adminOrdersSlice.actions;
export const { listAction: listAdminOrdersAction, showAction: showAdminOrderAction } = adminOrdersThunk;
