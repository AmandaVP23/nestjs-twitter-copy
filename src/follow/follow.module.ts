import { Module } from '@nestjs/common';
import { FollowController } from './follow.controller';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowRepository } from './follow.repository';
import { UsersModule } from '../users/users.module';
import { FollowService } from './follow.service';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        TypeOrmModule.forFeature([FollowRepository]),
        UsersModule,
    ],
    controllers: [
        FollowController,
    ],
    providers: [
        FollowService,
    ]
})
export class FollowModule {}
