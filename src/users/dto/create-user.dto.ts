import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(255)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    password: string;
}
