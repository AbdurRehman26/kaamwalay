import { Expose, Type } from 'class-transformer';

export abstract class Entity {
    public id!: string;

    @Type(() => Date)
    @Expose({ name: 'created_at' })
    public createdAt!: Date;

    @Type(() => Date)
    @Expose({ name: 'updated_at' })
    public updatedAt!: Date;
}
