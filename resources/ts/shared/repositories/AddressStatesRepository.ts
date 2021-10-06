import { Injectable } from '../decorators/Injectable';
import { AddressStateEntity } from '../entities/AddressStateEntity';
import { Repository } from './Repository';

@Injectable('AddressStatesRepository')
export class AddressStatesRepository extends Repository<AddressStateEntity> {
    readonly endpointPath: string = 'customer/addresses/states';
    readonly model = AddressStateEntity;
}
