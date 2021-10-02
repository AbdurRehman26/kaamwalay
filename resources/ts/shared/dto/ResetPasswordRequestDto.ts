import { IsNotEmpty, MinLength } from 'class-validator';
import { ErrorMessages } from '@shared/lib/errors/ErrorMessage';
import { createErrorMessageOption } from '@shared/lib/errors/createErrorMessage';
import { Field } from '../decorators/Field';

export class ResetPasswordRequestDto {
    @IsNotEmpty({ message: 'Missing reset password token!' })
    public token!: string;

    @IsNotEmpty({ message: 'Missing reset password email!' })
    public email!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Password'))
    @MinLength(8, createErrorMessageOption(ErrorMessages.ShouldHaveAtLeastNCharacters, 'Password', '8'))
    public password!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Password confirmation'))
    @MinLength(8, createErrorMessageOption(ErrorMessages.ShouldHaveAtLeastNCharacters, 'Password confirmation', '8'))
    @Field('passwordConfirmation', { toPlainOnly: true })
    public passwordConfirmation!: string;
}
