import { Type } from 'class-transformer';
import { CardProductEntity } from '@shared/entities/CardProductEntity';
import { UserCardGeneratedImagesEntity } from '@shared/entities/UserCardGeneratedImagesEntity';
import { UserCardGradesEntity } from '@shared/entities/UserCardGradesEntity';
import { UserCardHumanGradesEntity } from '@shared/entities/UserCardHumanGradesEntity';
import { Entity } from './Entity';

export class UserCardEntity extends Entity {
    public overallGrade!: string;
    public overallGradeNickname!: string;
    public certificateNumber!: string;
    public submissionNumber!: string;

    @Type(() => CardProductEntity)
    public cardProduct!: CardProductEntity;

    @Type(() => UserCardGradesEntity)
    public overallValues!: UserCardGradesEntity;

    @Type(() => UserCardHumanGradesEntity)
    public humanGradeValues!: UserCardHumanGradesEntity;

    @Type(() => UserCardGeneratedImagesEntity)
    public generatedImages!: UserCardGeneratedImagesEntity[];
}
