import { AxiosRequestConfig } from 'axios';
import { SalesRepCommissionPaymentsEntity } from '@shared/entities/SalesRepCommissionPaymentsEntity';
import { useListQuery } from '@shared/hooks/useListQuery';
import { listSalesRepCommissionPaymentsAction } from '@shared/redux/slices/salesRepCommissionPaymentsSlice';

export function useSalesRepsCommissionPaymentsQuery(config: AxiosRequestConfig) {
    return useListQuery(
        listSalesRepCommissionPaymentsAction,
        SalesRepCommissionPaymentsEntity,
        (state) => state.salesRepCommissionPayments,
        config,
    );
}
