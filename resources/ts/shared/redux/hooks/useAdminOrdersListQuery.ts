import { AxiosRequestConfig } from 'axios';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminOrdersAction } from '@shared/redux/slices/adminOrdersListSlice';

export function useAdminOrdersListQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminOrdersAction, OrderEntity, (state) => state.adminOrdersList, config);
}
