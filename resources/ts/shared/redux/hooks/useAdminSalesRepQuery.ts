import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { useShowQuery } from '../../hooks/useShowQuery';
import { ThunkShowActionArg } from '../../types/ThunkShowActionArg';
import { showAdminSalesRepAction } from '../slices/adminSalesRepSlice';

export function useAdminSalesRepQuery(options: ThunkShowActionArg) {
    return useShowQuery(showAdminSalesRepAction, SalesRepEntity, (state) => state.adminSalesRep, options);
}
