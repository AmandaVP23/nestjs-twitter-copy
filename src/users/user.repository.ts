import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.username = createUserDto.username;
        user.email = createUserDto.email;
        user.name = createUserDto.name;
        user.password = await this.hashPassword(createUserDto.password);

        try {
            await user.save();
            return user;
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Username or name already exists');
            } else {
                // se é qualquer outro erro dá 500
                throw new InternalServerErrorException();
            }
        }
    }

    private async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        return bcrypt.hash(password, salt);
    }
}