import { AxiosRequestConfig } from 'axios';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminSalesMenAction } from '../slices/adminSalesmenSlice';

export function useAdminSalesMenQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminSalesMenAction, SalesRepEntity, (state) => state.adminSalesMen, config);
}
