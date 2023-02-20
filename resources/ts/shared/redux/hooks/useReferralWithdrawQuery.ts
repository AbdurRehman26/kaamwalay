import { AxiosRequestConfig } from 'axios';
import { ReferralCommissionEarningsEntity } from '@shared/entities/ReferralCommissionEarningsEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listReferralCommissionEarningsAction } from '@shared/redux/slices/referralCommissionEarningsSlice';

export function useListReferralWithdrawQuery(config?: AxiosRequestConfig) {
    return useListQuery(
        listReferralCommissionEarningsAction,
        ReferralCommissionEarningsEntity,
        (state) => state.referralCommissionEarnings,
        config,
    );
}
