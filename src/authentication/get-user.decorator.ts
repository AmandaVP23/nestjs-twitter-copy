import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { SuperUser } from '../users/entities/super-user.entity';

export const GetUser = createParamDecorator((data: unknown, ctx: ExecutionContext): SuperUser => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
});
