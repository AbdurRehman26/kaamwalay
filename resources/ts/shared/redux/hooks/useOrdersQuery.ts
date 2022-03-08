import { AxiosRequestConfig } from 'axios';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminOrdersAction } from '@shared/redux/slices/adminOrdersSlice';
import { listOrdersAction } from '@shared/redux/slices/ordersSlice';
import { listPendingOrdersAction } from '@shared/redux/slices/pendingOrdersSlice';

export function useListOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listOrdersAction, OrderEntity, (state) => state.orders, config);
}

export function usePendingListOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listPendingOrdersAction, OrderEntity, (state) => state.pendingOrders, config);
}

export function useListAdminOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminOrdersAction, OrderEntity, (state) => state.adminOrders, config);
}
