import { AxiosRequestConfig } from 'axios';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminPromoCodesAction } from '@shared/redux/slices/adminPromoCodesSlice';

export function useListAdminPromoCodesQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminPromoCodesAction, PromoCodeEntity, (state) => state.adminPromoCodes, config);
}
