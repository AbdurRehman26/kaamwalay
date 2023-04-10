import { AxiosRequestConfig } from 'axios';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { useShowQuery } from '@shared/hooks/useShowQuery';
import { listAdminOrdersListAction, showAdminOrderShowAction } from '@shared/redux/slices/adminOrdersListSlice';
import { ThunkShowActionArg } from '@shared/types/ThunkShowActionArg';

export function useAdminOrdersListQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminOrdersListAction, OrderEntity, (state) => state.adminOrdersList, config);
}

export function useAdminOrderShowQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminOrderShowAction, OrderEntity, (state) => state.adminOrdersList, options);
}
