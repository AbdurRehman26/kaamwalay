import { AxiosRequestConfig } from 'axios';
import { ReferrerEntity } from '@shared/entities/ReferrerEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listReferralAction } from '@shared/redux/slices/referralSlice';

export function useListReferralQuery(config?: AxiosRequestConfig) {
    return useListQuery(listReferralAction, ReferrerEntity, (state) => state.referral, config);
}
