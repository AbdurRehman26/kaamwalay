import { Type } from 'class-transformer';
import { Entity } from '@shared/entities/Entity';
import { SalesRepEntity } from '@shared/entities/SalesRepEntity';
import { UserEntity } from './UserEntity';

export class SalesRepCommissionPaymentsEntity extends Entity {
    public amount!: number;
    public fileUrl!: string;
    public notes!: string;

    @Type(() => UserEntity)
    public addedBy!: UserEntity;

    @Type(() => SalesRepEntity)
    public salesman!: SalesRepEntity;
}
