import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { isNotEmpty, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength, ValidateIf } from 'class-validator';

export class UpdateUserDto extends PickType(CreateUserDto, ['username', 'name']) {
    // @IsNotEmpty()
    // @MinLength(3)
    // @MaxLength(20)
    // username: string;
    //
    // @IsNotEmpty()
    // @MinLength(4)
    // @MaxLength(255)
    // name: string;

    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    newPassword: string;

    @ValidateIf(o => isNotEmpty(o.newPassword))
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    passwordConfirmation: string;
}
