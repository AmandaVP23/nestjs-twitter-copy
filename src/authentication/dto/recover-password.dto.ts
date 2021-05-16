import { IsNotEmpty, IsString } from 'class-validator';

export class RecoverPasswordDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}