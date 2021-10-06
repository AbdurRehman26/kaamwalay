import { IsEmail, IsNotEmpty } from 'class-validator';
import { ErrorMessages } from '@shared/lib/errors/ErrorMessage';
import { createErrorMessageOption } from '@shared/lib/errors/createErrorMessage';

export class LoginRequestDto {
    @IsEmail({}, createErrorMessageOption(ErrorMessages.ShouldBeValidEmailAddress, 'Email'))
    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Email'))
    public email!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Password'))
    public password!: string;
}
