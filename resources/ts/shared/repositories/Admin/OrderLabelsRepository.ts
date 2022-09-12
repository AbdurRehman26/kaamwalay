import { Injectable } from '../../decorators/Injectable';
import { CardLabelEntity } from '../../entities/CardLabelEntity';
import { Repository } from '../Repository';

@Injectable('OrderLabelsRepository')
export class OrderLabelsRepository extends Repository<CardLabelEntity> {
    readonly endpointPath: string = 'admin/orders/:id/labels';
    readonly model = CardLabelEntity;

    public async storeOrderLabel(input: any) {
        const { data } = await this.endpoint.post('', input);
        return this.toEntity(data);
    }
}
