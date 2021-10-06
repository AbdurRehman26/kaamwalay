import { Moment } from 'moment';
import { DateField } from '../decorators/DateField';

export abstract class Entity<T extends string | number = number> {
    public id!: T;

    @DateField()
    public createdAt!: Moment;

    @DateField()
    public updatedAt!: Moment;
}
