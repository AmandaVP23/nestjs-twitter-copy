import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
    ) {}

    create(createUserDto: CreateUserDto, avatarFile: Express.Multer.File) {
        return this.userRepository.createUser(createUserDto, avatarFile);
    }

    findAll(options: IPaginationOptions<User>) {
        return this.userRepository.getUsers(options);
    }

    findOne(id: string) {
        return this.userRepository.getUser(id);
    }

    update(id: string, updateUserDto: UpdateUserDto, avatarFile: Express.Multer.File) {
        return this.userRepository.updateUser(id, updateUserDto, avatarFile);
    }

    deleteAccount(user: User, deleteAccountDto: DeleteAccountDto) {
        return this.userRepository.deleteAccount(user, deleteAccountDto);
    }
}
