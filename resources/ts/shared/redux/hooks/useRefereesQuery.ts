import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminRefereesAction } from '../slices/adminRefereesSlice';

export function useAdminRefereesQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminRefereesAction, CustomerEntity, (state) => state.adminReferees, config);
}
