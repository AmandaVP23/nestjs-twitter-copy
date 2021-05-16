import { BaseEntity, Column, DeleteDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Role } from '../role.enum';

@Entity()
@TableInheritance({ column: 'type' })
export abstract class SuperUser extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: Role,
    })
    type: Role;

    @Column()
    @Exclude()
    @ApiHideProperty()
    password: string;

    @DeleteDateColumn()
    @Exclude()
    @ApiHideProperty()
    deletedAt?: Date;

    async validatePassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
}