import { CustomerEntity } from '@shared/entities/CustomerEntity';
import CustomerDetail from './CustomerDetail';

interface CustomerViewOverViewTabProps {
    customer: CustomerEntity;
}

export function CustomerViewOverViewTab({ customer }: CustomerViewOverViewTabProps) {
    return <CustomerDetail customer={customer} />;
}

export default CustomerViewOverViewTab;
