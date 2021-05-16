import { EntityRepository, Repository } from 'typeorm';
import { Follow } from '../users/entities/follow.entity';
import { User } from '../users/entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(Follow)
export class FollowRepository extends Repository<Follow> {
    async createNewFollow(user: User, followerUser: User) {
        const existingFollow =  await this.findFollow(user, followerUser)

        if (existingFollow) {
            try {
                await existingFollow.remove();
                // await followerUser.decrementFollowing();
                // await user.decrementFollowers();
                return true;
            } catch (e) {
                throw new InternalServerErrorException();
            }
        }

        const follow = new Follow();
        follow.user = followerUser; // user that is followed
        follow.follower = user; // user that follows

        try {
            await follow.save();
            // await followerUser.incrementFollowing();
            // await user.incrementFollowers();
            return true;
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async findFollow(user: User, followerUser: User) {
        const query = this.createQueryBuilder('follow');
        query.where('user = :username', { username: user.username });
        query.andWhere('follower = :followerUsername', { followerUsername: followerUser.username });

        try {
            return await query.getOne();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async getUserFollowers(username: string, options: IPaginationOptions<Follow>) {
        // const user = await this.find({ where: { user: user.username } })

        const query = this.createQueryBuilder('follow');
        query.innerJoinAndSelect('follow.follower', 'follower')
        query.where('user = :username', { username });

        try {
            // return await this.find({ where: { user: user.username } })
            return paginate(query, options);
            // return await query.getMany();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async getUserFollowing(username: string, options: IPaginationOptions<Follow>) {
        const query = this.createQueryBuilder('follow');
        query.innerJoinAndSelect('follow.user', 'follower')
        query.where('follower = :username', { username });

        try {
            return paginate(query, options);
            // return await query.getMany();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}
