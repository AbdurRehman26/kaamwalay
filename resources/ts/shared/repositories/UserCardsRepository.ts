import { UserCardEntity } from '@shared/entities/UserCardEntity';
import { Injectable } from '../decorators/Injectable';
import { Repository } from './Repository';

@Injectable('UserCardsRepository')
export class UserCardsRepository extends Repository<UserCardEntity> {
    readonly endpointPath: string = 'customer/cards';
    readonly model = UserCardEntity;

    public async changeUserCardOwnerShip(input: { userCardIds: any; userId: number }) {
        const { data } = await this.endpoint.post('change-ownership', input);

        return data;
    }
}
