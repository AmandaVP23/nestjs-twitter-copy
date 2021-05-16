import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthenticationCredentialsDto {
    @IsNotEmpty()
    emailOrUsername: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    password: string;
}