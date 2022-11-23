import { AxiosRequestConfig } from 'axios';
import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listAdminSalesRepCommissionPaymentsAction } from '@shared/redux/slices/adminSalesRepCommissionPayments';

export function useAdminSalesRepsCommissionPaymentsQuery(config: AxiosRequestConfig) {
    return useListQuery(
        listAdminSalesRepCommissionPaymentsAction,
        SalesRepCommissionPaymentsEntity,
        (state) => state.adminSalesRepCommissionPayments,
        config,
    );
}
