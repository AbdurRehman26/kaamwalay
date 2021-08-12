import { AxiosRequestConfig } from 'axios';

import { OrderEntity } from '../entities/OrderEntity';
import { listOrdersAction } from '../redux/slices/ordersSlice';
import { useListQuery } from './useListQuery';

export function useListOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listOrdersAction, OrderEntity, (state) => state.orders, config);
}
