import { Injectable } from '@nestjs/common';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TweetRepository } from './tweet.repository';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Tweet } from './entities/tweet.entity';

@Injectable()
export class TweetsService {
    constructor(
        @InjectRepository(TweetRepository) private tweetRepository: TweetRepository,
    ) {}

    findAll(options: IPaginationOptions<Tweet>) {
        return this.tweetRepository.getAll(options);
    }

    create(createTweetDto: CreateTweetDto, user: User) {
        return this.tweetRepository.createTweet(createTweetDto, user);
    }

    findByUser(username: string, options: IPaginationOptions<Tweet>) {
        return this.tweetRepository.getByUser(username, options);
    }

    findOne(id: number) {
        return this.tweetRepository.getTweet(id);
    }

    remove(id: number, user: User) {
        return this.tweetRepository.removeTweet(id, user);
    }
}
