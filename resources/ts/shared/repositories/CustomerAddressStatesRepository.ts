import { Injectable } from '@shared/decorators/Injectable';
import { CustomerAddressStateEntity } from '@shared/entities/CustomerAddressStateEntity';

import { Repository } from './Repository';

@Injectable()
export class CustomerAddressStatesRepository extends Repository<CustomerAddressStateEntity> {
    readonly endpointPath: string = 'customer/addresses/states';
    readonly model = CustomerAddressStateEntity;
}
