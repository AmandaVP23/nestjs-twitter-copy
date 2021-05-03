import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
@Unique(['email', 'username'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    name: string;

    @Column()
    password: string;

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password);
        return hash === this.password;
    }
}
