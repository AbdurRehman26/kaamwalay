import { IsNotEmpty, MinLength } from 'class-validator';

import { Field } from '../decorators/Field';

export class ResetPasswordRequestDto {
    @IsNotEmpty()
    public token!: string;

    @IsNotEmpty()
    public email!: string;

    @IsNotEmpty()
    @MinLength(8)
    public password!: string;

    @IsNotEmpty()
    @MinLength(8)
    @Field('password_confirmation', { toPlainOnly: true })
    public passwordConfirmation!: string;
}
