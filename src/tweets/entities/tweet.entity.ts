import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm';
import { MaxLength } from 'class-validator';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Tweet extends BaseEntity  {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MaxLength(140)
    text: string;

    @ManyToOne(() => User, user => user.tweets, { eager: true, onUpdate: 'CASCADE' })
    @JoinColumn({ referencedColumnName: 'username' })
    user: User;

    @CreateDateColumn()
    createdDate: Date;
}
