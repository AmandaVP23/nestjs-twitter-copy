import { EntityRepository, Repository } from 'typeorm';
import { EmailToken } from './entities/email-token.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@EntityRepository(EmailToken)
export class EmailTokenRepository extends Repository<EmailToken> {

    async addToken(email: string) {
        const emailToken = new EmailToken();
        emailToken.email = email;

        const token = String(uuid()).replace(/-/g, '');
        emailToken.token = token;

        try {
            await emailToken.save();
            return token;
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    async removeToken(email: string) {
        try {
            await this.delete(email)
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }
}