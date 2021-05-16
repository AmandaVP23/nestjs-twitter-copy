import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put, Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../authentication/get-user.decorator';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiImplicitFile } from '@nestjs/swagger/dist/decorators/api-implicit-file.decorator';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { ErrorCode, getErrorException } from '../api/error-code-exception';

// export const multerOptions = {
//     storage: diskStorage({
//         destination: './uploads/avatar',
//         filename: (req, file, cb) => {
//             const filename: string = uuid();
//             const extension: string = path.parse(file.originalname).ext;
//
//             cb(null, `${filename}${extension}`)
//         }
//     })
// }

export const multerOptions = {
    limits: {
        fieldSize: 1024,  // 1Kb
    },
    fileFilter: (req: Request, file, cb) => {
        console.log(file.mimetype);

        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(null, false);
        }

        return cb(null, true);
    },
}

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        ) {}

    @Post()
    @ApiOperation({
        description: 'Create a new user account'
    })
    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'photo', required: false })
    create(@UploadedFile() file: Express.Multer.File, @Body(ValidationPipe) createUserDto: CreateUserDto) {
        if (!file) throw new BadRequestException(getErrorException(ErrorCode.INVALID_IMAGE_FORMAT));

        return this.usersService.create(createUserDto, file);
    }

    @Get()
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    findAll(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        limit = limit > 100 ? 100 : limit;
        return this.usersService.findAll({
            page,
            limit,
        });
    }

    @Put('/update')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    @UseInterceptors(FileInterceptor('photo', multerOptions))
    @ApiConsumes('multipart/form-data')
    @ApiImplicitFile({ name: 'photo', required: false })
    updateLoggedUser(@UploadedFile() file: Express.Multer.File, @Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
        return this.usersService.update(String(user.id), updateUserDto, file);
    }

    @Put('/update/:id')
    @ApiOperation({
        description: 'Updates a user. Admin only'
    })
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @GetUser() user: User) {
        return this.usersService.update(id, updateUserDto, null);
    }


    @Post('/delete-account')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    @ApiOperation({
        description: 'User delete his own account'
    })
    deleteOwnAccount(@GetUser() user: User, @Body() deleteAccountDto: DeleteAccountDto) {
        return this.usersService.deleteAccount(user, deleteAccountDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.usersService.findOne(id);
    }

}
