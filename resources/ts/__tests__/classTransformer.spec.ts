import { classToPlain, Expose, plainToClass } from 'class-transformer';
import 'reflect-metadata';

describe('Class Transformer', () => {
    it('should be able to transform json to class with named props', function () {
        const data = {
            foo: 'foo',
            bar: 'bar',
            // eslint-disable-next-line camelcase
            foo_bar: 'foo & bar',
        };

        class Foo {
            foo!: string;
            bar!: string;

            @Expose({ name: 'foo_bar' })
            fooBar!: string;
        }

        const foo = plainToClass(Foo, data);
        expect(foo).toBeDefined();
        expect(foo).toBeInstanceOf(Foo);
        expect(foo.fooBar).toEqual(data.foo_bar);

        const fooJson = classToPlain(foo);
        expect(fooJson).toBeDefined();
        expect(fooJson).not.toBeInstanceOf(Foo);
        expect(fooJson.foo_bar).toEqual(data.foo_bar);
    });
});
