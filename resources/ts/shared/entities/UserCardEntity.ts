import { Field } from '../decorators/Field';
import { Entity } from './Entity';

export class UserCardEntity extends Entity {
    @Field('overall_grade')
    public overallGrade!: string;

    @Field('overall_grade_nickname')
    public overallGradeNickname!: string;
}
