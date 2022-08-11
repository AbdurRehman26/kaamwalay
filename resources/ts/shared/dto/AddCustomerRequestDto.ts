import { IsEmail, IsNotEmpty, IsPhoneNumber, ValidateIf } from 'class-validator';
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

    @ValidateIf((dto) => typeof dto.phone !== 'undefined' && dto.phone !== '')
    @IsPhoneNumber('US', createErrorMessageOption(ErrorMessages.ShouldBeValidPhoneNumber, 'Phone'))
    public phone?: string;
}
