import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminCustomersReferralCommissionAction } from '../slices/adminCustomerReferralCommissionSlice';

export function useAdminCustomerReferralCommissionQuery(config?: AxiosRequestConfig) {
    return useListQuery(
        listAdminCustomersReferralCommissionAction,
        CustomerEntity,
        (state) => state.adminCustomerReferralCommission,
        config,
    );
}
