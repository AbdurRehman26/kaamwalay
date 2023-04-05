import { AxiosRequestConfig } from 'axios';
import { ReferralCustomerSignUpsEntity } from '@shared/entities/ReferralCustomerSignUpsEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listReferralCustomerSignUpsAction } from '@shared/redux/slices/referralCustomerSignUpsSlice';

export function useListReferralCustomerSignUpsQuery(config?: AxiosRequestConfig) {
    return useListQuery(
        listReferralCustomerSignUpsAction,
        ReferralCustomerSignUpsEntity,
        (state) => state.referralCustomerSignUps,
        config,
    );
}
