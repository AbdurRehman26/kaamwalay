import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { AddCardToOrderDto } from '@shared/dto/AddCardToOrderDto';
import { EditCardOfOrderDto } from '@shared/dto/EditCardOfOrderDto';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { OrderItemEntity } from '@shared/entities/OrderItemEntity';
import { app } from '@shared/lib/app';
import { OrdersRepository } from '@shared/repositories/SalesRep/OrdersRepository';
import { APIState } from '@shared/types/APIState';
import { WalletEntity } from '../../entities/WalletEntity';
import { WalletRepository } from '../../repositories/SalesRep/WalletRepository';
import { NotificationsService } from '../../services/NotificationsService';
import { createRepositoryThunk } from '../utlis/createRepositoryThunk';

interface StateType extends APIState<OrderEntity> {}

const salesRepOrdersThunk = createRepositoryThunk('salesRepOrders', OrdersRepository);

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

export const salesRepOrdersSlice = createSlice({
    name: salesRepOrdersThunk.name,
    initialState: {
        ...salesRepOrdersThunk.initialState,
    } as StateType,
    reducers: {
        invalidateAdminOrders: salesRepOrdersThunk.invalidateEntities,
    },
    extraReducers: (builder) => {
        salesRepOrdersThunk.buildReducers(builder);

        function manageOrderAndItem(state: StateType, payload: any) {
            const orderItem = plainToInstance(OrderItemEntity, payload);
            const order = plainToInstance(OrderEntity, state.entities[orderItem.orderId]);
            if (order) {
                order.addItem(orderItem);
                state.entities[orderItem.orderId] = instanceToPlain(order) as any;
            }
        }

        builder.addCase(addCardToOrder.fulfilled, (state, { payload }) => {
            manageOrderAndItem(state, payload);
        });

        builder.addCase(editCardOfOrder.fulfilled, (state, { payload }) => {
            manageOrderAndItem(state, payload);
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

export const { invalidateAdminOrders } = salesRepOrdersSlice.actions;
export const { listAction: listSalesRepOrdersAction, showAction: showSalesRepOrderAction } = salesRepOrdersThunk;
