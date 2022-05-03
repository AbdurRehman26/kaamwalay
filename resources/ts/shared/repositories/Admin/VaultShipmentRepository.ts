import { Injectable } from '../../decorators/Injectable';
import { VaultShipmentEntity } from '../../entities/VaultShipmentEntity';
import { Repository } from '../Repository';

@Injectable('AdminVaultShipmentRepository')
export class VaultShipmentRepository extends Repository<VaultShipmentEntity> {
    readonly endpointPath: string = '/admin/vault-shipments';
    readonly model = VaultShipmentEntity;
}
