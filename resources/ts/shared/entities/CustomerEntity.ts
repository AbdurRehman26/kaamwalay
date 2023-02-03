import { Type } from 'class-transformer';
import { SalesRepEntity } from './SalesRepEntity';
import { UserEntity } from './UserEntity';

export class CustomerEntity extends UserEntity {
    public submissions!: number;
    public cardsCount!: number;
    public createdBy!: UserEntity;
    public lastLoginAt!: string;
    public orders?: number;
    public cards?: number;
    public sales?: number;
    public unpaidCommission?: number;
    public unpaidCommissionTillLastMonth?: number;
    public paidCommission?: number;

    @Type(() => SalesRepEntity)
    public salesman!: SalesRepEntity;
}
