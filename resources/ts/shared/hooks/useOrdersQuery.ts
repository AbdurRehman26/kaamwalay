import { OrderEntity } from '../entities/OrderEntity';
import { listOrdersAction } from '../redux/slices/ordersSlice';
import { useSliceQuery } from './useSliceQuery';

export function useListOrdersQuery() {
    return useSliceQuery<OrderEntity>(listOrdersAction, OrderEntity, (state) => state.orders);
}
