import { EntityRepository, Repository } from 'typeorm';
import { Tweet } from './entities/tweet.entity';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { User } from '../users/entities/user.entity';
import { InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@EntityRepository(Tweet)
export class TweetRepository extends Repository<Tweet> {
    async getAll(options: IPaginationOptions<Tweet>) {
        const queryBuilder = this.createQueryBuilder('tweet');
        queryBuilder.orderBy('tweet.createdDate', 'DESC');

        return paginate(queryBuilder, options);
    }

    async createTweet(createTweetDto: CreateTweetDto, user: User) {
        const tweet = new Tweet();
        tweet.text = createTweetDto.text;
        tweet.user = user;

        try {
            await tweet.save();
            return tweet;
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async getByUser(username: string, options: IPaginationOptions<Tweet>) {
        const query = this.createQueryBuilder('tweet');
        query.where('tweet.userUsername = :username', { username });
        query.orderBy('tweet.createdDate', 'DESC');

        try {
            return paginate(query, options);
        } catch (error) {
            throw new InternalServerErrorException();
        }
    }

    async getTweet(id: number) {
        const tweet = this.findOne(id);

        if (!tweet) throw new NotFoundException();

        return tweet;
    }

    async removeTweet(id: number, user: User) {
        const tweet = await this.findOne(id);

        if (!tweet) throw new NotFoundException();

        if (tweet.user.id !== user.id) throw new UnauthorizedException();

        try {
            await tweet.remove();
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}