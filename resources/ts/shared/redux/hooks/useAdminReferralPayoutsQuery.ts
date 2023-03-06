import { AxiosRequestConfig } from 'axios';
import { PayoutEntity } from '@shared/entities/PayoutEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminReferralPayoutAction } from '@shared/redux/slices/adminReferralPayoutSlice';

export function useAdminReferralPayoutsQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminReferralPayoutAction, PayoutEntity, (state) => state.adminReferralPayout, config);
}
