import { Exception } from './Exception';

describe('exceptions/Exception', function () {
    it('should create correct error', function () {
        class FooException extends Exception {}

        expect(() => {
            throw new FooException('Foo is bar.');
        }).toThrow(FooException);

        expect(new FooException('test')).toBeInstanceOf(Exception);
        expect(new FooException('test')).toBeInstanceOf(Error);
    });
});
