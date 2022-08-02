import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminCustomersAction } from '../slices/adminCustomersSlice';

export function useAdminCustomersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminCustomersAction, CustomerEntity, (state) => state.adminCustomers, config);
}
