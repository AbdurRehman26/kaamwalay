import { plainToInstance } from 'class-transformer';
import { DateField } from './DateField';

class Foo {
    @DateField()
    date!: Date;
}

describe('DateField', () => {
    it('should correctly treat Date', function () {
        const date = new Date();
        const foo = plainToInstance(Foo, { date });
        expect(foo).toBeDefined();
        expect(foo.date).toBeInstanceOf(Date);
        expect(foo.date.getTime()).toEqual(date.getTime());
    });

    it('should correctly treat number', function () {
        const date = new Date();
        const foo = plainToInstance(Foo, { date: date.getTime() });
        expect(foo).toBeDefined();
        expect(foo.date).toBeInstanceOf(Date);
        expect(foo.date.getTime()).toEqual(date.getTime());
    });

    it('should correctly treat string', function () {
        const date = new Date();
        const foo = plainToInstance(Foo, { date: date.toISOString() });
        expect(foo).toBeDefined();
        expect(foo.date).toBeInstanceOf(Date);
        expect(foo.date.getTime()).toEqual(date.getTime());
    });
});
