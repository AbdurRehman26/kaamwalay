import { OrderEntity } from '../entities/OrderEntity';
import { showOrderAction } from '../redux/slices/ordersSlice';
import { ThunkShowActionArg } from '../types/ThunkShowActionArg';
import { useShowQuery } from './useShowQuery';

export function useOrderQuery(options: ThunkShowActionArg) {
    return useShowQuery(showOrderAction, OrderEntity, (state) => state.orders, options);
}
