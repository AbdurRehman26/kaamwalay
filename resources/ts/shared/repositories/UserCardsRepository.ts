import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { Injectable } from '../decorators/Injectable';
import { Repository } from './Repository';

@Injectable('UserCardsRepository')
export class UserCardsRepository extends Repository<UserCardEntity> {
    readonly endpointPath: string = 'customer/cards';
    readonly model = UserCardEntity;
}
