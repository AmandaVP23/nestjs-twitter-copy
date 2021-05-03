import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(3)
    @MaxLength(20)
    username: string;

    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(255)
    name: string;
}
