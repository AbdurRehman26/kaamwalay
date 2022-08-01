import { AxiosRequestConfig } from 'axios';
import { UserEntity } from '../../entities/UserEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminCustomersAction } from '../slices/adminCustomersSlice';

export function useAdminCustomersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminCustomersAction, UserEntity, (state) => state.adminCustomers, config);
}
