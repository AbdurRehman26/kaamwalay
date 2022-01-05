import { AxiosRequestConfig } from 'axios';
import { useListQuery } from '@shared/hooks/useListQuery';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { listAdminPromoCodesAction } from '@shared/redux/slices/adminPromoCodesSlice';

export function useListAdminPromoCodesQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminPromoCodesAction, PromoCodeEntity, (state) => state.adminPromoCodes, config);
}
