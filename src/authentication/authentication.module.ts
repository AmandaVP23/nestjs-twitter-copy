import { CacheModule, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from '../users/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { EmailTokenRepository } from './email-token.repository';
import { SuperUserRepository } from '../users/super-user.repository';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../users/roles.guard';

@Module({
    imports: [
        CacheModule.register(),
        PassportModule.register({
            defaultStrategy: 'jwt',
        }),
        JwtModule.register({
            secret: 'hZu`*1r(%`XpyfyI@qkv]Fr^1%sB)184aB',
            signOptions: {
                expiresIn: 3600, // segundos - 1h
            }
        }),
        TypeOrmModule.forFeature([UserRepository, EmailTokenRepository, SuperUserRepository]),
    ],
    providers: [
        AuthenticationService,
        JwtStrategy,
    ],
    exports: [
        JwtStrategy,
    ],
    controllers: [AuthenticationController]
})
export class AuthenticationModule {}
