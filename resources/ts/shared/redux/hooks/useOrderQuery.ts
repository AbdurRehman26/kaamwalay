import { OrderEntity } from '@shared/entities/OrderEntity';
import { useShowQuery } from '@shared/hooks/useShowQuery';
import { showAdminOrderAction } from '@shared/redux/slices/adminOrdersSlice';
import { showOrderAction } from '@shared/redux/slices/ordersSlice';
import { ThunkShowActionArg } from '@shared/types/ThunkShowActionArg';

export function useOrderQuery(options: ThunkShowActionArg) {
    return useShowQuery(showOrderAction, OrderEntity, (state) => state.orders, options);
}

export function useAdminOrderQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminOrderAction, OrderEntity, (state) => state.adminOrders, options);
}
