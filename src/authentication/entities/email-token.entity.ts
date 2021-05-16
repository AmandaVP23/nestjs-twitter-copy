import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, PrimaryColumn } from 'typeorm';
import * as dayjs from 'dayjs';

@Entity()
export class EmailToken extends BaseEntity {
    @PrimaryColumn()
    email: string;

    @Column()
    token: string;

    @Column()
    expireDate: Date;

    @BeforeInsert()
    @BeforeUpdate()
    stampExpireDate() {
        const date = dayjs().add(15, 'minutes');
        this.expireDate = date.toDate();
    }
}