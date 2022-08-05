import { UserEntity } from './UserEntity';

export class CustomerEntity extends UserEntity {
    public submissions!: number;
    public cardsCount!: number;
    public createdBy!: UserEntity;
    public lastLoginAt!: string;
}
