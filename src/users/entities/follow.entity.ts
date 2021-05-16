import {
    AfterInsert, AfterRemove,
    BaseEntity,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user', referencedColumnName: 'username' })
    user: User;

    @ManyToOne(() => User, { eager: false, onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn({ name: 'follower', referencedColumnName: 'username' })
    follower: User;

    @CreateDateColumn()
    followDate: Date;

    @AfterInsert()
    async increment() {
        await this.user.incrementFollowers();
        await this.follower.incrementFollowing();
    }

    @AfterRemove()
    async decrement() {
        await this.user.decrementFollowers();
        await this.follower.decrementFollowing();
    }
}