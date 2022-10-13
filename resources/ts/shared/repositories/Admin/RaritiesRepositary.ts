import { plainToInstance } from 'class-transformer';
import { Injectable } from '@shared/decorators/Injectable';
import { CardRarityEntity } from '@shared/entities/CardRarityEntity';
import { Repository } from '@shared/repositories/Repository';

@Injectable('AdminRaritiesRepositary')
export class RaritiesRepositary extends Repository<CardRarityEntity> {
    readonly endpointPath: string = 'admin/cards/rarities';
    readonly model = CardRarityEntity;

    async getRarity(rarityId: any): Promise<CardRarityEntity> {
        const { data } = await this.endpoint.get<CardRarityEntity>(`${rarityId}`);
        return plainToInstance(CardRarityEntity, data);
    }
}
