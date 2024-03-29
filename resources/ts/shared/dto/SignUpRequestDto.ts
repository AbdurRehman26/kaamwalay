import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength, ValidateIf } from 'class-validator';
import { ErrorMessages } from '../lib/errors/ErrorMessage';
import { createErrorMessageOption } from '../lib/errors/createErrorMessage';

export class SignUpRequestDto {
    @IsEmail({}, createErrorMessageOption(ErrorMessages.ShouldBeValidEmailAddress, 'Email'))
    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Email'))
    public email!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Name'))
    public fullName!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Password'))
    @MinLength(8, createErrorMessageOption(ErrorMessages.ShouldHaveAtLeastNCharacters, 'Password', '8'))
    public password!: string;

    @IsNotEmpty(createErrorMessageOption(ErrorMessages.ShouldNotBeEmpty, 'Password confirmation'))
    @MinLength(8, createErrorMessageOption(ErrorMessages.ShouldHaveAtLeastNCharacters, 'Password confirmation', '8'))
    public passwordConfirmation!: string;

    @ValidateIf((dto) => typeof dto.phone !== 'undefined' && dto.phone !== '')
    @IsPhoneNumber('US', createErrorMessageOption(ErrorMessages.ShouldBeValidPhoneNumber, 'Phone'))
    public phone?: string;

    public referralCode?: string;

    public isMarketingNotificationsEnabled!: boolean;
}
