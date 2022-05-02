import { DateField } from '../decorators/DateField';

export abstract class Entity<T extends string | number = number> {
    public id!: T;

    @DateField()
    public createdAt!: Date;

    @DateField()
    public updatedAt!: Date;
}
