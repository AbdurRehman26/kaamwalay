import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '../../entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { useShowQuery } from '../../hooks/useShowQuery';
import { ThunkShowActionArg } from '../../types/ThunkShowActionArg';
import { listAdminCustomersListAction, showAdminCustomerShowAction } from '../slices/adminCustomersListSlice';

export function useAdminCustomersListQuery(config?: AxiosRequestConfig) {
    return useListQuery(listAdminCustomersListAction, CustomerEntity, (state) => state.adminCustomersList, config);
}

export function useAdminCustomersShowQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminCustomerShowAction, CustomerEntity, (state) => state.adminCustomersList, options);
}
