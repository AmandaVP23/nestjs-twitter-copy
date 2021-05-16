import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FollowRepository } from './follow.repository';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Follow } from '../users/entities/follow.entity';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(FollowRepository) private followRepository: FollowRepository,
        private usersService: UsersService,
    ) {}

    async followUser(user: User, followUsername: string) {
        const followerUser = await this.usersService.findOne(followUsername);

        return await this.followRepository.createNewFollow(user, followerUser);
    }

    async getFollowers(username: string, options: IPaginationOptions<Follow>) {
        return await this.followRepository.getUserFollowers(username, options);
    }

    async getFollowing(username: string, options: IPaginationOptions<Follow>) {
        return await this.followRepository.getUserFollowing(username, options);
    }
}