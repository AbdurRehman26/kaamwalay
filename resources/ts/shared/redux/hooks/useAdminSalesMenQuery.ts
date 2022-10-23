import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminSalesMenAction } from '../slices/adminSalesmenSlice';

export function useAdminSalesMenQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminSalesMenAction, CustomerEntity, (state) => state.adminSalesMen, config);
}
