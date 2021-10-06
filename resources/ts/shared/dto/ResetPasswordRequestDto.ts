import { IsNotEmpty, MinLength } from 'class-validator';
import { Field } from '../decorators/Field';
import { ErrorMessages } from '../lib/errors/ErrorMessage';
import { createErrorMessageOption } from '../lib/errors/createErrorMessage';

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
