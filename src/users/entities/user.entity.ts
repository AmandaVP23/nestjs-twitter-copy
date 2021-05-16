import { ChildEntity, Column, OneToMany } from 'typeorm';
import { SuperUser } from './super-user.entity';
import { Tweet } from '../../tweets/entities/tweet.entity';
import { RelationCountAttribute } from 'typeorm/query-builder/relation-count/RelationCountAttribute';
import { RelationCountMetadata } from 'typeorm/metadata/RelationCountMetadata';
import { QueryExpressionMap } from 'typeorm/query-builder/QueryExpressionMap';
import { Follow } from './follow.entity';

@ChildEntity()
export class User extends SuperUser {
    @Column({ unique: true })
    username: string;

    @Column()
    avatarUrl: string;

    @OneToMany(() => Tweet, tweet => tweet.user, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    tweets: Tweet[];

    @OneToMany(() => Follow, f => f.follower, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    followers: Follow[];

    @OneToMany(() => Follow, f => f.user, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    following: Follow[];

    @Column({ default: 0 })
    followersCount: number;

    @Column({ default: 0 })
    followingCount: number;

    async incrementFollowers() {
        this.followersCount++;
        await this.save();
    }

    async incrementFollowing() {
        this.followingCount++;
        await this.save();
    }

    async decrementFollowers() {
        this.followersCount--;
        await this.save();
    }

    async decrementFollowing() {
        this.followingCount++;
        await this.save();
    }
}
