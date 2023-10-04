import { AxiosRequestConfig } from 'axios';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listOrdersAction } from '@shared/redux/slices/ordersSlice';
import { listSalesRepOrdersAction } from '@shared/redux/slices/salesRepOrdersSlice';

export function useListOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listOrdersAction, OrderEntity, (state) => state.orders, config);
}
export function useListSalesRepOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listSalesRepOrdersAction, OrderEntity, (state) => state.salesRepOrders, config);
}
