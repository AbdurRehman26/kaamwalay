import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignUpRequestDto {
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsNotEmpty()
    public fullName!: string;

    @IsNotEmpty()
    public username!: string;

    @IsNotEmpty()
    @MinLength(8)
    public password!: string;

    @IsNotEmpty()
    @MinLength(8)
    public passwordConfirmation!: string;
}
