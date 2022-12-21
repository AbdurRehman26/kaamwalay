import { CustomerEntity } from '../../entities/CustomerEntity';
import { useShowQuery } from '../../hooks/useShowQuery';
import { ThunkShowActionArg } from '../../types/ThunkShowActionArg';
import { showAdminCustomerAction } from '../slices/adminCustomersSlice';
import { showSalesRepCustomerAction } from '../slices/salesRepCustomersSlice';

export function useAdminCustomerQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminCustomerAction, CustomerEntity, (state) => state.adminCustomers, options);
}

export function useSalesRepCustomerQuery(options: ThunkShowActionArg) {
    return useShowQuery(showSalesRepCustomerAction, CustomerEntity, (state) => state.salesRepCustomers, options);
}
