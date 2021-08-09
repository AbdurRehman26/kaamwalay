import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignUpRequestDto {
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsNotEmpty()
    public password!: string;

    @IsNotEmpty()
    public fullName!: string;

    @IsNotEmpty()
    public username!: string;

    @IsNotEmpty()
    public confirmationPassword!: string;
}
