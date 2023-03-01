import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminReferrersAction } from '../slices/adminReferrersSlice';

export function useAdminReferrersQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminReferrersAction, CustomerEntity, (state) => state.adminReferrers, config);
}
