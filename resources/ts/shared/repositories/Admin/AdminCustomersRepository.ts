import { CustomersRepository } from './CustomersRepository';

export class AdminCustomersRepository extends CustomersRepository {
    readonly endpointConfig = {
        version: 'v3',
    };
}
