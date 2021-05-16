import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
    BadRequestException,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException
} from '@nestjs/common';
import { AuthenticationCredentialsDto } from '../authentication/dto/authentication-credentials.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as config from 'config';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { v4 as uuid } from 'uuid';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { ErrorCode, getErrorException } from '../api/error-code-exception';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserDto: CreateUserDto, avatarFile: Express.Multer.File) {
        const user = new User();
        user.username = createUserDto.username;
        user.email = createUserDto.email;
        user.name = createUserDto.name;
        user.password = await this.hashPassword(createUserDto.password);

        const avatarFilename = this.getAvatarFilename(avatarFile);
        user.avatarUrl = avatarFilename ? this.getAvatarUrl(avatarFilename) : null;

        fs.writeFile(path.resolve('.', 'uploads', 'avatar', avatarFilename), avatarFile.buffer, err => {
            if (err) {
                throw new InternalServerErrorException();
            }
        });

        try {
            await user.save();

            return user;
        } catch (error) {
            fs.unlink(path.resolve('.', 'uploads', 'avatar', avatarFilename), err => {
                if (err) throw new InternalServerErrorException();
            })

            if (error.code === 'ER_DUP_ENTRY') {
                let msg = 'Username already in use';

                if (error.sqlMessage.includes(user.email)) {
                    msg = 'Email already in use';
                }

                throw new BadRequestException(msg);
            } else {
                throw new InternalServerErrorException();
            }
        }
    }

    async getUsers(options: IPaginationOptions<User>) {
        const query = this.createQueryBuilder('user');

        return paginate(query, options);
    }

    async getUser(id: string): Promise<User> {
        const query = this.createQueryBuilder('user');
        query.where('user.id = :userId', { userId: id });
        query.orWhere('user.username = :username', { username: id });

        const user = await query.getOne();

        if (!user) {
            throw new NotFoundException();
        }

        return user;
    }

    async updateUser(id: string, updateUserDto: UpdateUserDto, avatarFile: Express.Multer.File) {
        const user = await this.getUser(id);

        user.name = updateUserDto.name;

        if (user.username !== updateUserDto.username) {
            user.username = updateUserDto.username;
        }

        if (avatarFile) {
            const avatarFilename = this.getAvatarFilename(avatarFile);
            user.avatarUrl = avatarFilename ? this.getAvatarUrl(avatarFilename) : null;
        }

        if (updateUserDto.newPassword && updateUserDto.passwordConfirmation) {
            if (!await user.validatePassword(updateUserDto.passwordConfirmation)) {
                throw new BadRequestException(getErrorException(ErrorCode.INVALID_CREDENTIALS))
            }
            user.password = await this.hashPassword(updateUserDto.newPassword);
        }

        try {
            await user.save();
            return user;
        } catch (e) {
            console.log(e);
            throw new InternalServerErrorException();
        }
    }

    async deleteAccount(user: User, deleteAccountDto: DeleteAccountDto) {
        if (await user.validatePassword(deleteAccountDto.password)) {
            try {
                await user.softRemove();
                return true;
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }
        throw new UnauthorizedException();
    }

    async validateUserPassword(authCredentialsDto: AuthenticationCredentialsDto): Promise<User> {
        const { emailOrUsername, password } = authCredentialsDto;

        // const user = await this.findOne({ email });
        const user = await this.createQueryBuilder('user')
            .where('user.email = :email', { email: emailOrUsername })
            .orWhere('user.username = :username', { username: emailOrUsername })
            .getOne();

        if (user && await user.validatePassword(password)) {
            return user;
        }

        return null;
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return await bcrypt.hash(password, salt);
    }

    getAvatarFilename(avatarFile: Express.Multer.File): string {
        const filename: string = uuid();
        const extension: string = path.parse(avatarFile.originalname).ext;
        return `${filename}${extension}`;
    }

    getAvatarUrl(filename: string): string {
        const serverConfig = config.get('server');

        let port = process.env.PORT || serverConfig.port;
        port = port || '';
        const domain = serverConfig.domain || '';
        const protocol = serverConfig.protocol || '';

        let avatarUrl = protocol + '://' + domain;
        if (port) {
            avatarUrl += ':' + port;
        }
        avatarUrl += '/public/avatar/' + filename;

        return avatarUrl;
    }
}