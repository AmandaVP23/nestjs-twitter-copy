import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const { statusCode } = context.switchToHttp().getResponse();

        if (statusCode === 201) {
            context.switchToHttp()
                .getResponse()
                .status(200);
        }

        return next.handle();
    }
}
