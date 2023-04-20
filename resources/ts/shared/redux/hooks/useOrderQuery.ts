import { OrderEntity } from '@shared/entities/OrderEntity';
import { useShowQuery } from '@shared/hooks/useShowQuery';
import { getOrder } from '@shared/redux/slices/adminOrdersSlice';
import { getCustomerOrder } from '@shared/redux/slices/ordersSlice';
import { showSalesRepOrderAction } from '@shared/redux/slices/salesRepOrdersSlice';
import { ThunkShowActionArg } from '@shared/types/ThunkShowActionArg';

export function useOrderQuery(options: ThunkShowActionArg) {
    return useShowQuery(getCustomerOrder, OrderEntity, (state) => state.orders, options);
}

export function useAdminOrderQuery(options: ThunkShowActionArg) {
    return useShowQuery(getOrder, OrderEntity, (state) => state.adminOrders, options);
}

export function useSalesRepOrderQuery(options: ThunkShowActionArg) {
    return useShowQuery(showSalesRepOrderAction, OrderEntity, (state) => state.salesRepOrders, options);
}
