import { AxiosRequestConfig } from 'axios';
import { CustomerEntity } from '@shared/entities/CustomerEntity';
import { useListQuery } from '../../hooks/useListQuery';
import { listAdminCustomersReferralSignUpAction } from '../slices/adminCustomerReferralSignUpSlice';

export function useAdminCustomerReferralSignUpQuery(config?: AxiosRequestConfig) {
    return useListQuery(
        listAdminCustomersReferralSignUpAction,
        CustomerEntity,
        (state) => state.adminCustomerReferralSignUp,
        config,
    );
}
