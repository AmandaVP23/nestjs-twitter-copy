import { Module } from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { TweetsController } from './tweets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetRepository } from './tweet.repository';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        TypeOrmModule.forFeature([TweetRepository]),
    ],
    controllers: [TweetsController],
    providers: [TweetsService]
})
export class TweetsModule {}
