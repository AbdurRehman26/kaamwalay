import 'reflect-metadata';
import { ValidateMethodParams } from '@shared/decorators/ValidateMethodParams';
import { SignUpRequestDto } from '@shared/dto/SignUpRequestDto';
import { ValidationException } from '@shared/exceptions/ValidationException';
import { ErrorMessages } from '@shared/lib/errors/ErrorMessage';
import { createErrorMessage } from '@shared/lib/errors/createErrorMessage';

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
        } catch (e) {
            expect(e).toBeInstanceOf(ValidationException);
            expect((e as ValidationException).errors[0].constraints).toMatchObject({
                isEmail: createErrorMessage(ErrorMessages.ShouldBeValidEmailAddress, 'Email'),
            });
        }
    });
});
