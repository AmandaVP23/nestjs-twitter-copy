import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [
        UsersController,
    ],
    exports: [
        UsersService,
    ],
    providers: [
        UsersService,
    ]
})
export class UsersModule {}
