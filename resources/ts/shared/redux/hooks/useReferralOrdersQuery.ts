import { AxiosRequestConfig } from 'axios';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminReferralOrdersAction } from '@shared/redux/slices/adminReferralOrdersSlice';

export function useListAdminReferralOrdersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminReferralOrdersAction, OrderEntity, (state) => state.adminReferralOrders, config);
}
