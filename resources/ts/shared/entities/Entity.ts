import { Moment } from 'moment';

import { DateField } from '../decorators/DateField';

export abstract class Entity<T extends string | number = number> {
    public id!: T;

    @DateField('created_at')
    public createdAt!: Moment;

    @DateField('updated_at')
    public updatedAt!: Moment;
}
