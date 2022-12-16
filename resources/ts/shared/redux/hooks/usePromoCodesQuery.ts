import { AxiosRequestConfig } from 'axios';
import { PromoCodeEntity } from '@shared/entities/PromoCodeEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminPromoCodesAction } from '@shared/redux/slices/adminPromoCodesSlice';
import { listSalesmanPromoCodesAction } from '@shared/redux/slices/salesmanPromoCodesSlice';

export function useListAdminPromoCodesQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminPromoCodesAction, PromoCodeEntity, (state) => state.adminPromoCodes, config);
}

export function useListSalesmanPromoCodesQuery(config?: AxiosRequestConfig) {
    return useListQuery(listSalesmanPromoCodesAction, PromoCodeEntity, (state) => state.salesmanPromoCodes, config);
}
