import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminCustomersAction } from '../slices/adminCustomersSlice';
import { listSalesRepCustomersAction } from '../slices/salesRepCustomersSlice';

export function useAdminCustomersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminCustomersAction, CustomerEntity, (state) => state.adminCustomers, config);
}

export function useSalesRepCustomersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listSalesRepCustomersAction, CustomerEntity, (state) => state.salesRepCustomers, config);
}
