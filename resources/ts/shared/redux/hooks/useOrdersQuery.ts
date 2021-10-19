import { AxiosRequestConfig } from 'axios';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminOrdersAction } from '@shared/redux/slices/adminOrdersSlice';
import { listOrdersAction } from '@shared/redux/slices/ordersSlice';

export function useListOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listOrdersAction, OrderEntity, (state) => state.orders, config);
}

export function useListAdminOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminOrdersAction, OrderEntity, (state) => state.adminOrders, config);
}
