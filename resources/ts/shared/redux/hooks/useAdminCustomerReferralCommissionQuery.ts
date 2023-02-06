import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { ThunkShowActionArg } from '@shared/types/ThunkShowActionArg';
import { useShowQuery } from '../../hooks/useShowQuery';
import { showAdminCustomersReferralAction } from '../slices/adminCustomerReferralSlice';

export function useAdminCustomerReferralCommissionQuery(options: ThunkShowActionArg) {
    return useShowQuery(
        showAdminCustomersReferralAction,
        CustomerEntity,
        (state) => state.adminCustomersReferral,
        options,
    );
}
