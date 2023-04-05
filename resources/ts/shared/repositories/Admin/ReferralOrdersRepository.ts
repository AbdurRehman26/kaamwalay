import { Injectable } from '@shared/decorators/Injectable';
import { OrderEntity } from '@shared/entities/OrderEntity';
import { Repository } from '../Repository';

@Injectable('AdminReferralOrdersRepository')
export class ReferralOrdersRepository extends Repository<OrderEntity> {
    readonly endpointPath: string = 'admin/referral-program/orders';
    readonly model = OrderEntity;

    readonly endpointConfig = {
        version: 'v3',
    };
}
