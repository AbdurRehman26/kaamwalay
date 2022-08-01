import { Injectable } from '../../decorators/Injectable';
import { UserEntity } from '../../entities/UserEntity';
import { Repository } from '../Repository';

@Injectable('CustomerRepository')
export class CustomerRepository extends Repository<UserEntity> {
    readonly endpointPath: string = 'admin/customers/:id';
    readonly model = UserEntity;
}
