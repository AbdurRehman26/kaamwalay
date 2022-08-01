import { Injectable } from '../../decorators/Injectable';
import { UserEntity } from '../../entities/UserEntity';
import { Repository } from '../Repository';

@Injectable('AdminCustomersRepository')
export class CustomersRepository extends Repository<UserEntity> {
    readonly endpointPath: string = 'admin/customers';
    readonly model = UserEntity;
}
