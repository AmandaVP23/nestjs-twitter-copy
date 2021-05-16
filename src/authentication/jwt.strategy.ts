import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtPayload } from './jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../users/user.repository';
import { User } from '../users/entities/user.entity';
import { SuperUserRepository } from '../users/super-user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(SuperUserRepository) private superUserRepository: SuperUserRepository,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {
        super({
            passReqToCallback: true,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'hZu`*1r(%`XpyfyI@qkv]Fr^1%sB)184aB',
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const { email } = payload;

        const user = await this.superUserRepository.findOne({ email });

        if (!user) throw new UnauthorizedException();

        const tokenFromCache = await this.cacheManager.get(user.email);

        if (!tokenFromCache) throw new UnauthorizedException();

        return user;
    }
}