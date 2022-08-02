import { CustomerEntity } from '../../entities/CustomerEntity';
import { useShowQuery } from '../../hooks/useShowQuery';
import { ThunkShowActionArg } from '../../types/ThunkShowActionArg';
import { showAdminCustomerAction as showAdminCustomerActions } from '../slices/adminCustomerSlice';
import { showAdminCustomerAction } from '../slices/adminCustomersSlice';

export function useAdminCustomerQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminCustomerAction, CustomerEntity, (state) => state.adminCustomers, options);
}

export function useAdminCustomerDataQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminCustomerActions, CustomerEntity, (state) => state.adminCustomer, options);
}
