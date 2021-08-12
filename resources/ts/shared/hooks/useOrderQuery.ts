import { ShowTuple } from '@shared/types/ShowTuple';

import { OrderEntity } from '../entities/OrderEntity';
import { showOrderAction } from '../redux/slices/ordersSlice';
import { useShowQuery } from './useShowQuery';

export function useOrderQuery(...args: ShowTuple) {
    return useShowQuery(showOrderAction, OrderEntity, (state) => state.orders, ...args);
}
