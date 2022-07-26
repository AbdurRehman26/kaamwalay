import { IsEmail, IsNotEmpty } from 'class-validator';
import { ErrorMessages } from '../lib/errors/ErrorMessage';
import { createErrorMessageOption } from '../lib/errors/createErrorMessage';

export class AddCustomerRequestDto {
    @IsEmail({}, createErrorMessageOption(ErrorMessages.ShouldBeValidEmailAddress, 'Email'))
    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Email'))
    public email!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'First Name'))
    public firstName!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Last Name'))
    public lastName!: string;

    public phone?: string;
}
