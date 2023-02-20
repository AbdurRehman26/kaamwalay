import { AxiosRequestConfig } from 'axios';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { showAdminCustomersReferralPayoutAction } from '../slices/adminCustomerReferralPayoutSlice';

export function useAdminCustomersPayoutQuery(config: AxiosRequestConfig) {
    return useListQuery(
        showAdminCustomersReferralPayoutAction,
        PayoutEntity,
        (state) => state.adminCustomerReferralPayout,
        config,
    );
}
