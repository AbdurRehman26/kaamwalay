import { AxiosRequestConfig } from 'axios';
import { ReferralWithdrawEntity } from '@shared/entities/ReferralWithdrawEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listReferralWithdrawAction } from '@shared/redux/slices/referralWithdrawSlice';

export function useListReferralWithdrawQuery(config?: AxiosRequestConfig) {
    return useListQuery(listReferralWithdrawAction, ReferralWithdrawEntity, (state) => state.referralWithdraw, config);
}
