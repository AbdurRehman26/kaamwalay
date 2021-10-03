import 'reflect-metadata';
import { ValidateMethodParams } from '../decorators/ValidateMethodParams';
import { ValidationException } from '../exceptions/ValidationException';
import { ErrorMessages } from '../lib/errors/ErrorMessage';
import { createErrorMessage } from '../lib/errors/createErrorMessage';
import { SignUpRequestDto } from './SignUpRequestDto';

describe('dto/SignupRequestDto', function () {
    it('should correctly parse errors', function () {
        class Foo {
            @ValidateMethodParams()
            attempt(input: SignUpRequestDto) {
                return input;
            }
        }

        const foo = new Foo();
        expect(foo).toBeInstanceOf(Foo);
        expect(() => foo.attempt({} as any)).toThrow(ValidationException);

        try {
            foo.attempt({ email: 'test' } as any);
        } catch (e: any) {
            expect(e).toBeInstanceOf(ValidationException);
            expect((e as ValidationException).errors[0].constraints).toMatchObject({
                isEmail: createErrorMessage(ErrorMessages.ShouldBeValidEmailAddress, 'Email'),
            });
        }
    });
});
