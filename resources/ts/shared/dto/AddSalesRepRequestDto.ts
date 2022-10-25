import { IsEmail, IsNotEmpty, IsPhoneNumber, ValidateIf } from 'class-validator';
import { ErrorMessages } from '../lib/errors/ErrorMessage';
import { createErrorMessageOption } from '../lib/errors/createErrorMessage';

export class AddSalesRepRequestDto {
    @IsEmail({}, createErrorMessageOption(ErrorMessages.ShouldBeValidEmailAddress, 'Email'))
    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Email'))
    public email!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'First Name'))
    public firstName!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Last Name'))
    public lastName!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'fixed Commission'))
    public fixedCommission!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Percent Commission'))
    public percentCommission!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'List Active'))
    public listActive!: boolean;

    @ValidateIf((dto) => typeof dto.phone !== 'undefined' && dto.phone !== '')
    @IsPhoneNumber('US', createErrorMessageOption(ErrorMessages.ShouldBeValidPhoneNumber, 'Phone'))
    public phone?: string;
}
