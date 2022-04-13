import { Injectable } from '../decorators/Injectable';
import { VaultShipmentEntity } from '../entities/VaultShipmentEntity';
import { Repository } from './Repository';

@Injectable('VaultShipmentsRepository')
export class VaultShipmentsRepository extends Repository<VaultShipmentEntity> {
    readonly endpointPath: string = 'customer/vault-shipments';
    readonly model = VaultShipmentEntity;
}
