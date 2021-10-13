import { Type } from 'class-transformer';
import { UserCardGradesEntity } from '@shared/entities/UserCardGradesEntity';
import { Entity } from './Entity';

export class UserCardHumanGradesEntity extends Entity {
    @Type(() => UserCardGradesEntity)
    public front!: UserCardGradesEntity;

    @Type(() => UserCardGradesEntity)
    public back!: UserCardGradesEntity;
}
