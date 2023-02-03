import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useAdminCustomerQuery } from '@shared/redux/hooks/useCustomerQuery';
import CustomerDetail from './CustomerDetail';
import { CustomerReferralCommissionEarnings } from './CustomerReferralCommissionEarnings';
import { CustomerReferralSignUp } from './CustomerReferralSignUp';

export function CustomerViewOverViewTab() {
    const { id } = useParams<'id'>();

    const customer$ = useAdminCustomerQuery({
        resourceId: Number(id),
    });

    const { data } = customer$;

    const handleReloadCustomerData = useCallback(() => {
        customer$.request();
    }, [customer$]);

    return (
        <>
            <CustomerDetail handleResendCall={handleReloadCustomerData} customer={data} />
            <CustomerReferralCommissionEarnings />
            <CustomerReferralSignUp />
        </>
    );
}

export default CustomerViewOverViewTab;
