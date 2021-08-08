import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginRequestDto {
    @IsEmail()
    @IsNotEmpty()
    public email!: string;

    @IsNotEmpty()
    public password!: string;
}
