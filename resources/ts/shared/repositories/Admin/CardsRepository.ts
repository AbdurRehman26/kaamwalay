import { Injectable } from '@shared/decorators/Injectable';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { Repository } from '@shared/repositories/Repository';

@Injectable('AdminCardsRepository')
export class CardsRepository extends Repository<CardProductEntity> {
    readonly endpointPath: string = 'admin/cards';
    readonly model = CardProductEntity;
}
