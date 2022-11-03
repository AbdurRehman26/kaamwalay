import { AxiosRequestConfig } from 'axios';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminSalesRepAction } from '../slices/adminSalesRepSlice';

export function useAdminSalesRepQuery(config: AxiosRequestConfig) {
    return useListQuery(listAdminSalesRepAction, SalesRepEntity, (state) => state.adminSalesRep, config);
}
