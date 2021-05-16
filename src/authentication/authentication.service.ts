import {
    BadRequestException,
    CACHE_MANAGER,
    Inject,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { AuthenticationCredentialsDto } from './dto/authentication-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '../users/entities/user.entity';
import { RecoverPasswordDto } from './dto/recover-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailTokenRepository } from './email-token.repository';
import { SuperUserRepository } from '../users/super-user.repository';
import { ErrorCode, getErrorException } from '../api/error-code-exception';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';

@Injectable()
export class AuthenticationService {
    constructor(
        @InjectRepository(UserRepository) private userRepository: UserRepository,
        @InjectRepository(SuperUserRepository) private superUserRepository: SuperUserRepository,
        @InjectRepository(EmailTokenRepository) private emailTokenRepository: EmailTokenRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private jwtService: JwtService,
        private mailerService: MailerService,
    ) {}

    async login(authenticationCredentialsDto: AuthenticationCredentialsDto) /*: Promise<LoginResponseDto> */ {
        const user = await this.superUserRepository.validateUserPassword(authenticationCredentialsDto);

        if (!user) {
            throw new UnauthorizedException(getErrorException(ErrorCode.INVALID_CREDENTIALS));
        }

        // @ts-ignore
        const accessToken = await this.generateAccessToken(user.email, user.username || '');

        await this.cacheManager.set(user.email, accessToken, { ttl: 3600 }); // ttl - seconds

        return {
            id: user.id,
            name: user.name,
            // @ts-ignore
            username: user.username || '',
            email: user.email,
            token: accessToken,
        };
    }

    async logout(token: string, user: User) {
        await this.cacheManager.del(user.email);
        return 'Ok';
    }

    async recoverPassword(recoverPasswordDto: RecoverPasswordDto) {
        const { email } = recoverPasswordDto;

        const user = await this.userRepository.createQueryBuilder('user')
            .where('email = :email', { email })
            .getOne();

        if (!user) {
            throw new BadRequestException();
        }

        try {
            await this.mailerService.sendMail({
                to: email,
                from: 'noreply@nestjs.com',
                subject: 'Recover password',
                template: path.join(__dirname, '..', 'templates', 'recover-password'),
                context: {
                    code: 'codeCode',
                    username: 'john doe'
                }
            })
        } catch (e) {
            console.log(e);
            throw e;
        }


        return this.emailTokenRepository.addToken(email);
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, password, token } = resetPasswordDto;

        const tokenFromDB = this.emailTokenRepository.createQueryBuilder('email_token')
            .where('token = :token', { token })
            .getOne();

        if (!tokenFromDB) {
            throw new BadRequestException('Token invalid');
        }

        const user = await this.userRepository.createQueryBuilder('user')
            .where('email = :email', { email })
            .getOne();

        if (!user) {
            throw new BadRequestException();
        }

        user.password = await this.userRepository.hashPassword(password);

        try {
            await user.save();

            this.emailTokenRepository.removeToken(user.email);

            const accessToken = await this.generateAccessToken(user.email, user.username);

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                token: accessToken,
            };
        } catch (e) {
            throw new InternalServerErrorException();
        }
    }

    private generateAccessToken(email: string, username: string) {
        const payload: JwtPayload = {
            email,
            username,
        };

        return this.jwtService.sign(payload);
    }
}
