import { Type } from 'class-transformer';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { UserCardGeneratedImagesEntity } from '@shared/entities/UserCardGeneratedImagesEntity';
import { UserCardGradesEntity } from '@shared/entities/UserCardGradesEntity';
import { UserCardHumanGradesEntity } from '@shared/entities/UserCardHumanGradesEntity';
import { Entity } from './Entity';
import { OrderItemEntity } from './OrderItemEntity';

export class UserCardEntity extends Entity {
    public overallGrade!: string;
    public overallGradeNickname!: string;
    public certificateNumber!: string;
    public orderNumber!: number | string;
    public orderId!: number | string;
    public shortName!: string;

    @Type(() => CardProductEntity)
    public cardProduct!: CardProductEntity;

    @Type(() => UserCardGradesEntity)
    public overallValues!: UserCardGradesEntity;

    @Type(() => UserCardHumanGradesEntity)
    public humanGradeValues!: UserCardHumanGradesEntity;

    @Type(() => UserCardGeneratedImagesEntity)
    public generatedImages!: UserCardGeneratedImagesEntity[];

    @Type(() => OrderItemEntity)
    public orderItem!: OrderItemEntity;
}
